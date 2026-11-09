/* The entrance in 3D (A Porta): the photograph, with depth.

   THE PHOTOGRAPH IS THE SKIN. Every surface the photograph shows is drawn FROM the photograph: each fragment takes the
   photo pixel its point had at rest, seen from the photograph's own camera (projective texturing from camera C0). At
   rest the frame is therefore the photograph itself, whatever the geometry; when a leaf turns it carries its own
   pixels. The geometry only adds what a flat picture cannot: the leaves' thickness and their raised-and-fielded
   panels (relief measured on the photo, so its photographed shading stays where it belongs), the knobs, escutcheon
   and hinge knuckles as small solids, the doorway's depth (jambs, soffit, the hall), parallax as the camera walks in,
   and light that only MODULATES the photo: each surface is multiplied by E(now) / E(rest), the irradiance of its
   current pose over the irradiance of its pose in the photograph (sun or lantern through the doorway, the street's
   sky, the hall's warm bounce, the knob's soft shadow), so the ratio is exactly 1 at rest and the photograph is never
   repainted. Brass adds the change of a restrained environment reflection (now minus rest), nothing more.

   The world (metres) is the one the interior plate was ray-traced in (photo/py/plate2.py): the photograph's camera
   C0 stands 3 m in front of the door, its focal length is 1512 px of the 2388 px master, so the facade image is
   4.738 x 5.226 m on the plane z = 0. Origin: the hall point (the vanishing point) on that plane; x right, y up,
   z towards the street. The hall is the plate's own box (floor -1.1, ceiling 2.05, walls +-1.08, far wall 3.8 m
   behind the door by day, 4.0 m by night), so the plate, projected from C0, lies on it exactly.

   The camera is the page's: the driver (site.js) gives the scene's rest rect on the canvas, the pan of the hall point
   (tx, ty, the CSS camera's translate), the CSS camera's zoom s and the camera's distance zc (in units of the rest
   distance: 1 at rest; site.js keeps it near, s^-0.12, and the lens makes up the rest, so the door's plane is
   magnified exactly s, as on the page, and the open leaves never sweep wider than the doorway they stand in).
   Without s (an older page) the camera dollies, zc = 1/s. Rendering happens only in frame(). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Mesh, Group, BufferGeometry, Float32BufferAttribute, ShaderMaterial,
  Texture, LinearMipmapLinearFilter, LinearFilter, ClampToEdgeWrapping, Vector2, Vector3, Vector4, Matrix4,
  LatheGeometry, CylinderGeometry, NormalBlending, DoubleSide, Color, WebGLRenderTarget, PlaneGeometry
} from "three";

const D = 3.0, MW = 2388, MH = 2634, F2 = 1512, WM = MW / F2 * D, HM = MH / F2 * D, LPX = 319, LPY = 1306;
const T = 0.055;                          /* leaf thickness */
const HALL = { floor: -1.1, ceil: 2.05, wall: 1.08 };
const JAMB = 0.81, WALLT = 0.4;           /* the reveal behind the frame: half width, wall thickness */

/* the leaves' relief, measured on the photograph (leaf px from the leaf's top-left; mw: moulding band, bw: bevel, per
   side l r t b). Profile across the band (share of mw, mm): stile 0, quirk, ovolo, groove; the bevel rises from the
   groove to the field. */
const PANELS = {
  l: [{ x0: 47, x1: 262, y0: 41, y1: 712, mw: [20, 11, 22, 24], bw: [25, 10, 19, 21] },
      { x0: 47, x1: 262, y0: 797, y1: 1169, mw: [20, 11, 22, 22], bw: [25, 10, 21, 23] }],
  r: [{ x0: 43, x1: 272, y0: 42, y1: 712, mw: [19, 21, 22, 24], bw: [30, 20, 19, 21] },
      { x0: 43, x1: 272, y0: 797, y1: 1169, mw: [19, 21, 22, 22], bw: [30, 20, 21, 23] }]
};
const PROFILE = [[0, 0], [0.12, -5], [0.22, -5], [0.5, -1], [0.78, -4], [1, -13]], FIELD = -5, SMOOTH = [2, 3, 4];
const KNOB = { l: [277, 750], r: [38, 750] }, ESC = [32, 815, 9, 20];
const HINGES = [[1002, 1057], [1516, 1575], [2043, 2104]];      /* master rows of the brass knuckles */
/* the closed leaves' gap, painted dark into the head of the frame just above them (master px x0 x1 y0 y1): with the
   doors open it takes the head's own lower face, from either side of it */
const NOTCH = [1080, 1206, 907, 920];
/* LOD bias of the photograph's samples: trilinear minification of the 2388 master is softer than the browser's own
   image scaling, so the take-over frame lost grain and edges (review r1); -0.65 matches the page's <img> (sharp.js) */
const BIAS = -0.65;
/* the canvas at the device's own pixel ratio, up to 3 (the iPhone case): at 2 the take-over frame was drawn at 2/3 of
   the page photograph's resolution and upscaled (review r1). Above 2 there is no MSAA (create()). */
const MAXDPR = 3;

const GLSL = `
uniform vec4 uPj;                 /* hall point (u, v), D, 0 */
uniform vec2 uWH;                 /* facade image size, metres */
vec2 proj(vec3 w) { float k = uPj.z / (uPj.z - w.z); return vec2(uPj.x + w.x * k / uWH.x, uPj.y - w.y * k / uWH.y); }
vec3 lin(vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }
vec3 enc(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }
uniform vec3 uSunDir, uSun, uSky, uHall, uLamp;
uniform float uLampOn;
uniform vec4 uDoor;               /* doorway x0 x1 y0 y1 (metres, plane z = 0) */
vec3 sunL(vec3 p) { return uLampOn > 0.5 ? normalize(uLamp - p) : uSunDir; }
float sunK(vec3 p) { vec3 d = uLamp - p; return uLampOn > 0.5 ? 2.6 / max(dot(d, d), 0.6) : 1.0; }
/* a point inside the wall (z < 0) sees the sun / lantern only through the opening */
float doorVis(vec3 p, vec3 L) {
  if (p.z > -0.002) return 1.0;
  float t = -p.z / max(L.z, 0.02);
  vec2 q = p.xy + L.xy * t;
  float e = 0.012 + 0.05 * t;
  return smoothstep(uDoor.x - e, uDoor.x + e, q.x) * smoothstep(uDoor.y + e, uDoor.y - e, q.x)
       * smoothstep(uDoor.w + e, uDoor.w - e, q.y) * step(-0.5, L.z);
}
float sphereSh(vec3 p, vec3 L, vec4 S) {
  vec3 d = S.xyz - p; float t = dot(d, L);
  if (t <= 0.0 || S.w <= 0.0) return 1.0;
  float h = length(d - L * t), pen = S.w * 0.3 + t * 0.16;
  return mix(0.3, 1.0, smoothstep(S.w - pen, S.w + pen, h));
}
vec3 irr(vec3 n, vec3 p, float sh) {
  vec3 L = sunL(p);
  float inside = smoothstep(0.0, 0.9, -p.z);
  return uSun * sunK(p) * max(dot(n, L), 0.0) * doorVis(p, L) * sh
       + uSky * (0.5 + 0.5 * n.z) * (1.0 - 0.45 * inside)
       + uHall * (0.5 - 0.5 * n.z) * (0.55 + 0.45 * inside);
}
`;
const VS = `
uniform mat4 uMRest;
attribute vec4 aExtra;           /* kind, edge u, edge v, unused */
varying vec3 vRest, vW, vNR, vNW;
varying vec4 vX;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vRest = (uMRest * vec4(position, 1.0)).xyz;
  vNW = normalize(mat3(modelMatrix) * normal);
  vNR = normalize(mat3(uMRest) * normal);
  vX = aExtra;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

/* wood and brass: the photo pixel (projected at rest, or the stile's grain on a newly seen face) x E(now) / E(rest) */
const FS_SOLID = GLSL + `
uniform sampler2D uTex;
uniform vec4 uRect;               /* the texture's rect, as a share of the facade */
uniform vec3 uCam, uCam0;
uniform vec4 uKnob;               /* the knob's head (world, now) and radius: its soft shadow on the leaf */
uniform vec4 uKnob0;              /* the same at rest */
uniform float uMetal, uSpec, uMaxM, uMinM;
uniform vec2 uClampX;             /* as the leaf opens, the gap's light painted on its free arris stays behind */
uniform vec4 uGap;                /* the light through the gap at rest, on the leaf near its free edge: edge x, side, amount, reach */
uniform float uGapNow;            /* 1 at rest, 0 once the gap is gone */
uniform vec3 uEnvTop, uEnvHor, uEnvLow, uEnvIn;
uniform float uBias;              /* LOD bias of the projected photo: as crisp as the page's own <img> (review r1) */
uniform vec4 uMean;               /* brass: where the photograph saw this part head-on (leaf uv, or the hinge's x in metres
                                     when z = 1) and the mip level that averages it (w) */
varying vec3 vRest, vW, vNR, vNW;
varying vec4 vX;
vec3 env(vec3 r) {
  vec3 c = mix(uEnvHor, uEnvTop, smoothstep(0.0, 0.85, r.y));
  c = mix(uEnvLow, c, smoothstep(-0.25, 0.05, r.y));
  return mix(c, uEnvIn, smoothstep(0.05, -0.6, r.z));
}
void main() {
  float kind = vX.x;
  vec3 a;
  vec3 nW = normalize(vNW), nR = normalize(vNR), pR = vRest;
  if (kind < 0.5) {
    vec2 uv = (proj(vRest) - uRect.xy) / uRect.zw;
    uv.x = clamp(uv.x, uClampX.x, uClampX.y);
    a = texture2D(uTex, clamp(uv, vec2(0.0005), vec2(0.9995)), uBias).rgb;
    if (uMetal > 0.5) {
      /* a brass face the photograph saw edge-on (the knob's neck, the rims, the hinge barrel's sides) would carry the
         silhouette's pixels smeared across it: it takes the photograph's own mean brass of that part instead */
      vec2 mu = uMean.z > 0.5 ? (proj(vec3(uMean.x, vRest.y, 0.0)) - uRect.xy) / uRect.zw : uMean.xy;
      vec3 mb = textureLod(uTex, clamp(mu, vec2(0.0005), vec2(0.9995)), uMean.w).rgb;
      float g = smoothstep(0.12, 0.4, dot(nR, normalize(uCam0 - pR)));
      a = mix(mb, a, g);
      nR = normalize(mix(vec3(0.0, 0.0, 1.0), nR, g));   /* and its light at rest: that of the part's face the mean comes from */
    }
  } else {
    a = texture2D(uTex, vX.yz).rgb * (kind > 1.5 ? 0.72 : 0.94);
    nR = vec3(0.0, 0.0, 1.0); pR = vec3(vRest.xy, 0.0);    /* lit as the face it was sampled from, at rest */
  }
  vec3 al = lin(a);
  vec3 Ln = sunL(vW), Lr = sunL(pR);
  vec3 eN = irr(nW, vW, sphereSh(vW, Ln, uKnob)), eR = irr(nR, pR, sphereSh(pR, Lr, uKnob0));
  vec3 m = clamp(eN / max(eR, vec3(1e-4)), vec3(uMinM), vec3(uMaxM));
  if (uGap.z > 0.0 && kind < 0.5) {
    float g = uGap.z * exp(-max((vRest.x - uGap.x) * uGap.y, 0.0) / uGap.w);
    m *= (1.0 + g * uGapNow) / (1.0 + g);
  }
  vec3 c = al * m;
  /* the change of the sheen (oiled walnut) or of the reflection (brass), never the photographed one itself */
  vec3 vN = normalize(uCam - vW), vR = normalize(uCam0 - pR);
  if (uMetal > 0.5) {
    vec3 f0 = vec3(0.92, 0.74, 0.40);
    float fN = 1.0 - max(dot(nW, vN), 0.0), fR = 1.0 - max(dot(nR, vR), 0.0);
    vec3 sN = env(reflect(-vN, nW)) * (f0 + (1.0 - f0) * pow(fN, 5.0));
    vec3 sR = env(reflect(-vR, nR)) * (f0 + (1.0 - f0) * pow(fR, 5.0));
    c += (sN - sR) * uSpec * al / max(dot(al, vec3(0.333)), 0.05) * 0.5;
  } else {
    vec3 hN = normalize(Ln + vN), hR = normalize(Lr + vR);
    float sN = pow(max(dot(nW, hN), 0.0), 22.0) * doorVis(vW, Ln) * sunK(vW);
    float sR = pow(max(dot(nR, hR), 0.0), 22.0) * doorVis(pR, Lr) * sunK(pR);
    /* never an absolute amount taken from the albedo: on dark walnut that empties the blue channel and the leaf turns
       red-orange (review r1). A new sheen adds light; the photographed one going away scales the photo pixel as a
       whole (its own chroma kept), by at most 12 % */
    float dS = (sN - sR) * uSpec, sl = dot(uSun, vec3(0.333));
    c += max(dS, 0.0) * uSun;
    c *= max(1.0 + min(dS, 0.0) * sl / max(dot(al, vec3(0.333)), 0.02), 0.88);
  }
  gl_FragColor = vec4(enc(c), 1.0);
}`;

/* the hall: the only part of the walk-in the photograph does not show. It stays the photograph's own plate (the
   ray-traced, defocused hall the page shows through the doorway), projected from C0 onto the plate's own box, so the
   doorway shows exactly the photograph's hall at rest and the walk-in has true parallax. It is never brought into
   focus: a box drawn sharp read as CG (review r1), so the lens stays on the door and the hall goes softer as the
   camera walks in (the lens blur, frame()). Light only modulates it: by day the sun through the opened doorway, cut
   by the leaves' shadows, and the leaves' contact shadow on the floor. */
const FS_HALL = GLSL + `
uniform sampler2D uPlate, uReveal;
uniform vec4 uPlateR, uDoorR;
uniform float uOpen, uSunK, uLeafW, uOpenK;
uniform float uSoft;              /* LOD bias as the camera walks in: seen from inside, the plate's surfaces near the door
                                     are stretched along the rays from C0, and its render grain would draw radial streaks */
varying vec3 vRest, vW, vNR, vNW;
varying vec4 vX;
/* the open leaves, seen from a point on the floor towards the light: does the ray cross leaf s (hinge at hx)? */
float leafSh(vec3 p, vec3 L, float hx, float a) {
  vec3 dl = vec3(cos(a) * -sign(hx), 0.0, -sin(a)), nl = vec3(-dl.z, 0.0, dl.x);
  float dn = dot(L, nl);
  if (abs(dn) < 1e-3) return 1.0;
  float t = dot(vec3(hx, 0.0, 0.0) - p, nl) / dn;
  if (t <= 0.0) return 1.0;
  vec3 q = p + L * t; float sl = dot(q - vec3(hx, 0.0, 0.0), dl), e = 0.03 + 0.04 * t;
  return 1.0 - smoothstep(-e, e, sl) * smoothstep(uLeafW + e, uLeafW - e, sl) * step(q.y, uDoor.w);
}
/* contact: the leaf's foot on the floor (distance to its footprint, x/z) */
float leafFoot(vec3 p, float hx, float a) {
  vec2 h = vec2(hx, 0.0), d = vec2(cos(a) * -sign(hx), -sin(a)), q = p.xz - h;
  float t = clamp(dot(q, d), 0.0, uLeafW);
  return length(q - d * t);
}
void main() {
  vec2 uv = proj(vW);
  vec3 c = texture2D(uPlate, clamp((uv - uPlateR.xy) / uPlateR.zw, vec2(0.0005), vec2(0.9995)), uSoft).rgb;
  vec2 rv = (uv - uDoorR.xy) / uDoorR.zw;
  if (rv.x > 0.0 && rv.x < 1.0 && rv.y > 0.0 && rv.y < 1.0) { vec4 r = texture2D(uReveal, rv, uSoft); c = mix(c, r.rgb, r.a); }
  if (uOpenK > 0.0) {
    vec3 n = normalize(vNW), p = vW, cl = lin(c);
    /* daylight through the opened doorway: a soft pool of sun on the stone, cut by the leaves' shadows */
    if (uSunK > 0.0 && n.y > -0.5) {
      float ndl = max(dot(n, uSunDir), 0.0);
      if (ndl > 0.0) cl *= 1.0 + uSunK * uOpenK * ndl * doorVis(p, uSunDir) * leafSh(p, uSunDir, uDoor.x, uOpen) * leafSh(p, uSunDir, uDoor.y, uOpen);
    }
    if (n.y > 0.5) {
      float f = min(leafFoot(p, uDoor.x, uOpen), leafFoot(p, uDoor.y, uOpen));
      cl *= 1.0 - uOpenK * (0.4 * exp(-f / 0.04) + 0.12 * exp(-f / 0.2));
    }
    cl = mix(cl, vec3(0.8) + 0.2 * (1.0 - exp(-(cl - 0.8) / 0.2)), step(vec3(0.8), cl));
    c = enc(cl);
  }
  gl_FragColor = vec4(c, 1.0);
}`;

/* the lintel's soffit, at the door's depth (so as sharp as the jambs, never in the hall's blur). Seen through the gap
   at rest, where it is the photograph's hall and the doorway's shade (exactly as the hall pass draws it there); as the
   doors open it becomes the pilasters' limestone in the lintel's shade: low-passed (its 5 mm pits would grow into
   blotches as the camera nears), a warm bounce tint, lighter towards the light (the street by day, the lamplit hall
   by night) (review r1) */
const FS_SOFFIT = GLSL + `
uniform sampler2D uPlate, uReveal, uTex;
uniform vec4 uPlateR, uDoorR;
uniform float uK;
varying vec3 vRest, vW, vNR, vNW;
varying vec4 vX;
void main() {
  vec2 uv = proj(vW);
  vec3 c = texture2D(uPlate, clamp((uv - uPlateR.xy) / uPlateR.zw, vec2(0.0005), vec2(0.9995))).rgb;
  vec2 rv = (uv - uDoorR.xy) / uDoorR.zw;
  if (rv.x > 0.0 && rv.x < 1.0 && rv.y > 0.0 && rv.y < 1.0) { vec4 r = texture2D(uReveal, rv); c = mix(c, r.rgb, r.a); }
  if (uK > 0.0) {
    /* the left pilaster's stone at about its own scale (the soffit's depth across the pilaster, its width along it),
       low-passed and at half its contrast (a surface in diffuse shade) */
    float d = clamp(-vW.z / WALLT_, 0.0, 1.0);
    vec2 q = vec2(0.236 + d * 0.062, 0.40 + (vW.x + 0.81) / 1.62 * 0.31), ts = vec2(textureSize(uTex, 0));
    float lod = log2(max(max(length(dFdx(q * ts)), length(dFdy(q * ts))), 1e-4));
    vec3 st = mix(textureLod(uTex, q, 5.5).rgb, textureLod(uTex, q, max(lod, 3.0)).rgb, 0.45);
    if (uLampOn > 0.5) st = enc(lin(st) * (0.6 + 1.6 * d) * vec3(1.0, 0.84, 0.62));   /* night: the hall's lamplight, warmer and stronger towards it */
    else st *= vec3(0.78, 0.74, 0.69) * mix(1.0, 0.88, d);                             /* day: a warm bounce, lighter towards the street */
    c = mix(c, st, uK);
  }
  gl_FragColor = vec4(c, 1.0);
}`.replace("WALLT_", WALLT.toFixed(3));

/* the jambs (newly seen): the stone of the photographed pilasters, lit for where they stand */
const FS_JAMB = GLSL + `
uniform sampler2D uTex;
varying vec3 vRest, vW, vNR, vNW;
varying vec4 vX;
void main() {
  vec3 a = lin(texture2D(uTex, vX.yz, -0.3).rgb);
  vec3 n = normalize(vNW), pR = vec3(vW.xy, 0.0);
  vec3 e = irr(n, vW, 1.0), e0 = irr(vec3(0.0, 0.0, 1.0), pR, 1.0);
  float ao = 0.55 + 0.45 * smoothstep(0.0, 0.18, -vW.z) * smoothstep(0.0, 0.18, WALLT_ + vW.z);
  gl_FragColor = vec4(enc(a * clamp(e / max(e0, vec3(1e-4)), vec3(0.2), vec3(1.2)) * ao), 1.0);
}`.replace("WALLT_", WALLT.toFixed(3));

/* the facade: the photograph on its plane and, round it, the street the page draws (photo.py › street, site.css
   .ph--street): the wall's gradient, the paving strip repeating at one facade width (three on wider screens), below it the colour the near
   paving blurs into, and by night the lantern's and the doorway's light as gains (the page's color-dodge); the
   photograph's own outer fade lies over it, as on the page. The doorway transparent; the lamplight on the steps
   (Noite) grows as the doors open */
const FS_FACADE = GLSL + `
uniform sampler2D uTex, uSpill, uStrip, uWallLut;
uniform vec4 uSpillR;
uniform float uSpillK, uOpenK;
uniform vec4 uDoorUV;             /* doorway x0, x1, bottom (v), as shares of the facade */
uniform vec4 uDoorR;              /* doorway x0 y0 x1 y1, shares of the facade */
uniform vec4 uNotch;              /* the gap's dark notch in the head of the frame: x0 x1 y0 y1, shares of the facade */
uniform vec3 uWall;
uniform float uBias;
uniform vec4 uSt;                 /* strip rows y0, y1 (shares of the facade's height), strip loaded (0/1), its period (facade widths) */
uniform vec2 uWL;                 /* the wall's gradient: rows y0, y1 of its lookup (a 256 x 1 texture of the stops) */
uniform vec3 uBelow;
uniform vec4 uLa[2], uLb[2];      /* lights: cx cy rx ry ; core power on 0 */
uniform vec3 uLg[2];              /* lights: gain - 1 at the centre */
varying vec3 vRest, vW, vNR, vNW;
varying vec4 vX;
/* one lookup for the wall, the strip or the colour below it, then the lights only inside their ellipses: a software
   renderer (the headless tests) drew the frame in twice the time with the stops walked per pixel */
vec3 street(vec2 uv) {
  vec3 c;
  if (uv.y >= uSt.y) c = uBelow;
  else if (uv.y >= uSt.x && uSt.z > 0.5) c = texture2D(uStrip, vec2(uv.x / max(uSt.w, 1.0), (uv.y - uSt.x) / (uSt.y - uSt.x))).rgb;
  else c = texture2D(uWallLut, vec2(clamp((uv.y - uWL.x) / (uWL.y - uWL.x), 0.0, 1.0) * (255.0 / 256.0) + 0.5 / 256.0, 0.5)).rgb;
  for (int i = 0; i < 2; i++) {
    if (uLa[i].z <= 0.0) continue;
    vec2 d = (uv - uLa[i].xy) / uLa[i].zw;
    float r2 = dot(d, d);
    if (r2 >= 1.0) continue;
    float f = pow(1.0 + r2 / (uLb[i].x * uLb[i].x), -uLb[i].y) * (1.0 - r2) * (1.0 - r2);
    c = min(c * (1.0 + f * uLg[i]), vec3(1.0));
  }
  return c;
}
void main() {
  vec2 uv = proj(vec3(vW.xy, 0.0));
  vec4 s;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) s = vec4(street(uv), 1.0);
  else {
    s = texture2D(uTex, uv, uBias);
    /* the photograph's outer fade lies over the street; the doorway's own transparency stays */
    bool door = uv.x > uDoorR.x - 0.01 && uv.x < uDoorR.z + 0.01 && uv.y > uDoorR.y - 0.01 && uv.y < uDoorR.w + 0.01;
    if (!door && s.a < 0.999) s = vec4(mix(street(uv), s.rgb, s.a), 1.0);
  }
  /* the closed gap's shadow painted into the head of the frame goes as the doors open: the head's own lower face,
     taken from either side of the notch at the same height */
  if (uOpenK > 0.0 && uv.y > uNotch.z && uv.y < uNotch.w && uv.x > uNotch.x - 0.002 && uv.x < uNotch.y + 0.002) {
    float px = 1.0 / 2388.0, f = clamp((uv.x - uNotch.x) / (uNotch.y - uNotch.x), 0.0, 1.0);
    vec3 h = mix(texture2D(uTex, vec2(uNotch.x - 3.0 * px, uv.y), uBias).rgb, texture2D(uTex, vec2(uNotch.y + 3.0 * px, uv.y), uBias).rgb, f);
    float k = smoothstep(uNotch.x - 2.0 * px, uNotch.x + px, uv.x) * smoothstep(uNotch.y + 2.0 * px, uNotch.y - px, uv.x)
            * smoothstep(uNotch.z, uNotch.z + 3.0 / 2634.0, uv.y);
    s.rgb = mix(s.rgb, h, uOpenK * k * s.a);
  }
  /* the shadow line the closed leaves cast on the sill goes as they open: the sill's own stone, a few px below */
  if (uOpenK > 0.0 && uv.x > uDoorUV.x && uv.x < uDoorUV.y && uv.y > uDoorUV.z - 0.0012 && uv.y < uDoorUV.z + 0.0026) {
    vec4 b = texture2D(uTex, vec2(uv.x, uDoorUV.z + 0.0034));
    s.rgb = mix(s.rgb, b.rgb, uOpenK * smoothstep(uDoorUV.z + 0.0026, uDoorUV.z + 0.0012, uv.y) * s.a);
  }
  if (uSpillK > 0.0) {
    vec2 q = (uv - uSpillR.xy) / uSpillR.zw;
    if (q.x > 0.0 && q.x < 1.0 && q.y > 0.0 && q.y < 1.0) { vec4 l = texture2D(uSpill, q); s.rgb = mix(s.rgb, l.rgb, l.a * uSpillK); }
  }
  if (s.a < 0.002) discard;
  gl_FragColor = s;
}`;

const THEMES = {
  dia: { sunDir: new Vector3(0.55, 0.5, 0.67).normalize(), sun: [1.0, 0.94, 0.84], sky: [0.62, 0.64, 0.68],
    hall: [0.78, 0.71, 0.6], lampOn: 0, minM: 0.5, maxM: 1.45, spec: 0.05, far: -3.8, wall: [250, 236, 223],
    gapGlow: 0, sunK: 1.1, blur: 4.0,
    env: { top: [1.15, 1.18, 1.25], hor: [0.95, 0.88, 0.78], low: [0.45, 0.4, 0.34], in: [0.8, 0.72, 0.6] } },
  noite: { sunDir: new Vector3(0, 0, 1), sun: [1.0, 0.64, 0.33], sky: [0.035, 0.04, 0.06], hall: [1.4, 0.9, 0.48],
    lampOn: 1, minM: 0.5, maxM: 8.0, spec: 0.03, far: -4.0, wall: [28, 20, 15], gapGlow: 50, sunK: 0, blur: 4.0,
    env: { top: [0.05, 0.06, 0.09], hor: [0.12, 0.09, 0.07], low: [0.03, 0.025, 0.02], in: [0.9, 0.6, 0.32] } }
};

function quad(arr, a, b, c, d) { arr.push(a, b, c, a, c, d); }

/* one leaf: front relief (projected), back, four edges. Leaf-local metres, the hinge corner at the origin; x grows
   towards the free edge for the left leaf, and goes negative for the right one (its hinge is on the right). */
function leafGeometry(side, w, h, top) {
  const sc = w / LPX, P = [], N = [], X = [];
  const X0 = (px) => (side === "l" ? px : px - LPX) * sc, Y0 = (py) => top - py * sc;
  function vtx(px, py, z, n, ex) { P.push(X0(px), Y0(py), z); N.push(n[0], n[1], n[2]); X.push(ex[0], ex[1], ex[2], 0); }
  function tri(list) { for (const v of list) vtx(v[0], v[1], v[2], v[3], v[4]); }
  const F = [0, 0, 0], Z = [0, 0, 1];
  function flat(x0, y0, x1, y1) {        /* a flat part of the face (stile, rail), z = 0 */
    if (x1 <= x0 || y1 <= y0) return;
    const a = [x0, y0, 0, Z, F], b = [x1, y0, 0, Z, F], c = [x1, y1, 0, Z, F], d = [x0, y1, 0, Z, F];
    tri([a, d, c, a, c, b]);
  }
  const panels = PANELS[side];
  flat(0, 0, LPX, panels[0].y0);
  flat(0, panels[0].y1, LPX, panels[1].y0);
  flat(0, panels[1].y1, LPX, LPY);
  for (const p of panels) { flat(0, p.y0, p.x0, p.y1); flat(p.x1, p.y0, LPX, p.y1); }
  /* rings: profile point k at inset (per side) ins[k] and height hk; the four sides meet on the mitres */
  for (const p of panels) {
    const pts = PROFILE.map(([f, mm]) => ({ ins: p.mw.map((m) => m * f), h: mm / 1000 }));
    pts.push({ ins: p.mw.map((m, i) => m + p.bw[i]), h: FIELD / 1000 });
    const rect = (ins) => [p.x0 + ins[0], p.x1 - ins[1], p.y0 + ins[2], p.y1 - ins[3]];
    /* outward direction of each side in leaf-local x/y (px y runs down, world y up) */
    const OUT = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    const segN = (k, s) => {               /* normal of segment k on side s */
      const di = (pts[k + 1].ins[s] - pts[k].ins[s]) * sc, dh = pts[k + 1].h - pts[k].h, sl = dh / Math.max(di, 1e-6);
      const o = OUT[s], v = [o[0] * sl, o[1] * sl, 1], l = Math.hypot(v[0], v[1], v[2]);
      return [v[0] / l, v[1] / l, v[2] / l];
    };
    const vN = (k, s, seg) => {            /* vertex normal: smooth across the ovolo, sharp elsewhere */
      if (SMOOTH.includes(k) && k > 0 && k < pts.length - 1) {
        const a = segN(k - 1, s), b = segN(k, s), v = [a[0] + b[0], a[1] + b[1], a[2] + b[2]], l = Math.hypot(...v);
        return [v[0] / l, v[1] / l, v[2] / l];
      }
      return segN(seg, s);
    };
    for (let k = 0; k < pts.length - 1; k++) {
      const A = rect(pts[k].ins), B = rect(pts[k + 1].ins), ha = pts[k].h, hb = pts[k + 1].h;
      /* corners: [x, y] of outer (A) and inner (B) rects: TL TR BR BL (px, y down) */
      const a = { tl: [A[0], A[2]], tr: [A[1], A[2]], br: [A[1], A[3]], bl: [A[0], A[3]] };
      const b = { tl: [B[0], B[2]], tr: [B[1], B[2]], br: [B[1], B[3]], bl: [B[0], B[3]] };
      const face = (s, o1, o2, i2, i1) => {
        const na = vN(k, s, k), nb = vN(k + 1, s, k);
        const A1 = [o1[0], o1[1], ha, na, F], A2 = [o2[0], o2[1], ha, na, F], B2 = [i2[0], i2[1], hb, nb, F], B1 = [i1[0], i1[1], hb, nb, F];
        tri([A1, A2, B2, A1, B2, B1]);
      };
      face(2, a.tl, a.tr, b.tr, b.tl);       /* top */
      face(1, a.tr, a.br, b.br, b.tr);       /* right */
      face(3, a.br, a.bl, b.bl, b.br);       /* bottom */
      face(0, a.bl, a.tl, b.tl, b.bl);       /* left */
    }
    const B = rect(pts[pts.length - 1].ins), hf = pts[pts.length - 1].h;
    tri([[B[0], B[2], hf, Z, F], [B[0], B[3], hf, Z, F], [B[1], B[3], hf, Z, F], [B[0], B[2], hf, Z, F], [B[1], B[3], hf, Z, F], [B[1], B[2], hf, Z, F]]);
  }
  /* back face and edges: the grain of the hinge stile (vertical edges, long grain) or of the rail (end grain) */
  const back = [0, 0, -1], ue = side === "l" ? 0.018 : 0.982, du = (T / w) * (side === "l" ? 1 : -1);
  for (const [x, nx] of [[0, -1], [LPX, 1]]) {
    const n = [nx, 0, 0], k = 1;
    const e = (py, z) => [x, py, z, n, [k, ue + (-z / T) * du, py / LPY]];
    tri([e(0, 0), e(LPY, 0), e(LPY, -T), e(0, 0), e(LPY, -T), e(0, -T)]);
  }
  for (const [y, ny] of [[0, 1], [LPY, -1]]) {
    const n = [0, ny, 0];
    const e = (px, z) => [px, y, z, n, [2, px / LPX, (y ? 0.985 : 0.012) + (-z / T) * 0.012]];
    tri([e(0, 0), e(LPX, 0), e(LPX, -T), e(0, 0), e(LPX, -T), e(0, -T)]);
  }
  const bk = (px, py) => [px, py, -T, back, [3, 1 - px / LPX, py / LPY]];
  tri([bk(0, 0), bk(LPX, 0), bk(LPX, LPY), bk(0, 0), bk(LPX, LPY), bk(0, LPY)]);
  /* winding does not matter (no culling on the leaf: its faces are closed and depth-tested) */
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(P, 3));
  g.setAttribute("normal", new Float32BufferAttribute(N, 3));
  g.setAttribute("aExtra", new Float32BufferAttribute(X, 4));
  return g;
}

function withExtra(g, kind) {
  const n = g.attributes.position.count, x = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) x[i * 4] = kind;
  g.setAttribute("aExtra", new Float32BufferAttribute(x, 4));
  return g;
}

/* a plane from four corners (world), with optional per-corner extra (kind, u, v) */
function plane(c, n, ex) {
  const P = [], N = [], X = [];
  for (const i of [0, 1, 2, 0, 2, 3]) { P.push(...c[i]); N.push(...n); X.push(...(ex ? ex[i] : [0, 0, 0]), 0); }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(P, 3));
  g.setAttribute("normal", new Float32BufferAttribute(N, 3));
  g.setAttribute("aExtra", new Float32BufferAttribute(X, 4));
  return g;
}

function tex(img) {
  const t = new Texture(img);
  t.flipY = false;
  t.generateMipmaps = true;
  t.minFilter = LinearMipmapLinearFilter;
  t.magFilter = LinearFilter;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.needsUpdate = true;
  return t;
}

export function create(canvas, G, opt) {
  opt = opt || {};
  /* a software renderer (no GPU, or a blocklisted one) would draw this at a few frames per second: the context is
     refused (failIfMajorPerformanceCaveat) and the page keeps its CSS entrance; ?3d=force forces it, for tests only */
  /* MSAA only up to a pixel ratio of 2: at 3 the edges are finer than the eye resolves, and a 4-sample buffer of an
     iPhone screen would cost ~47 MB for nothing. The default power preference: on a two-GPU laptop the discrete GPU
     is not woken (and kept awake) for a few seconds of doors. */
  const renderer = new WebGLRenderer({ canvas, antialias: Math.min(window.devicePixelRatio || 1, opt.maxDpr || MAXDPR) <= 2, alpha: false, depth: true,
    stencil: false, powerPreference: "default", preserveDrawingBuffer: !!opt.preserve, failIfMajorPerformanceCaveat: !opt.force });
  {                                       /* the same for a software renderer that does not declare the caveat */
    const gl = renderer.getContext(), ext = gl.getExtension("WEBGL_debug_renderer_info"),
      name = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    if (!opt.force && /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)) { renderer.dispose(); throw new Error("software context: " + name); }
  }
  renderer.autoClear = true;
  renderer.sortObjects = true;
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const scene = new Scene();
  const camera = new PerspectiveCamera();
  camera.matrixAutoUpdate = false;
  const X = (u) => (u - G.hp[0]) * WM, Y = (v) => (G.hp[1] - v) * HM;
  const door = { x0: X(G.door[0]), x1: X(G.door[2]), top: Y(G.door[1]), bot: Y(G.door[3]) };
  const gap = { l: X(G.gap[0]), r: X(G.gap[1]) };
  const leafW = gap.l - door.x0, leafH = door.top - door.bot, sc = leafW / LPX;
  const rectOf = (x0, y0, x1, y1) => new Vector4(x0, y0, x1 - x0, y1 - y0);
  const common = () => ({
    uPj: { value: new Vector4(G.hp[0], G.hp[1], D, 0) }, uWH: { value: new Vector2(WM, HM) },
    uSunDir: { value: new Vector3() }, uSun: { value: new Vector3() }, uSky: { value: new Vector3() },
    uHall: { value: new Vector3() }, uLamp: { value: new Vector3(X(0.1633), Y(0.3417), 0.32) }, uLampOn: { value: 0 },
    uDoor: { value: new Vector4(door.x0, door.x1, door.bot, door.top) }, uMRest: { value: new Matrix4() }
  });
  const mats = [];
  function mat(fs, extra, o) {
    const m = new ShaderMaterial(Object.assign({ vertexShader: VS, fragmentShader: fs, uniforms: Object.assign(common(), extra), side: DoubleSide }, o || {}));
    mats.push(m);
    return m;
  }
  const solidU = (rect) => ({
    uTex: { value: null }, uRect: { value: rect }, uCam: { value: new Vector3(0, 0, D) }, uCam0: { value: new Vector3(0, 0, D) },
    uKnob: { value: new Vector4() }, uKnob0: { value: new Vector4() }, uMetal: { value: 0 }, uSpec: { value: 0.05 },
    uMaxM: { value: 1.5 }, uMinM: { value: 0.5 }, uClampX: { value: new Vector2(0, 1) }, uGap: { value: new Vector4() }, uGapNow: { value: 1 },
    uEnvTop: { value: new Vector3() }, uEnvHor: { value: new Vector3() }, uEnvLow: { value: new Vector3() }, uEnvIn: { value: new Vector3() },
    uBias: { value: BIAS }, uMean: { value: new Vector4(0.5, 0.5, 0, 3) }
  });

  /* the hall: the plate's box */
  const plateU = () => ({ uPlate: { value: null }, uReveal: { value: null },
    uPlateR: { value: rectOf(G.plate[0], G.plate[1], G.plate[2], G.plate[3]) }, uDoorR: { value: rectOf(G.door[0], G.door[1], G.door[2], G.door[3]) } });
  const hallMat = mat(FS_HALL, Object.assign(plateU(), { uOpen: { value: 0 }, uOpenK: { value: 0 }, uSunK: { value: 0 }, uLeafW: { value: 0.633 }, uSoft: { value: 0 } }));
  /* the hall is drawn first, on its own (it is always the farthest layer: the leaves stand on its floor, the jambs and
     the facade are in front), into a half-size target, softened by a lens blur that grows as the camera walks in (the
     photograph's plate at rest is already defocused: no blur there), then laid under the rest of the scene */
  const hall = new Group(), sceneH = new Scene();
  sceneH.add(hall);
  const rtA = new WebGLRenderTarget(4, 4, { depthBuffer: true, stencilBuffer: false }),
    rtB = new WebGLRenderTarget(4, 4, { depthBuffer: false, stencilBuffer: false });
  for (const r of [rtA, rtB]) { r.texture.minFilter = LinearFilter; r.texture.magFilter = LinearFilter; r.texture.generateMipmaps = false; }
  const QV = "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
  const blurMat = new ShaderMaterial({ vertexShader: QV, depthTest: false, depthWrite: false,
    uniforms: { uT: { value: null }, uD: { value: new Vector2() } },
    fragmentShader: `uniform sampler2D uT; uniform vec2 uD; varying vec2 vUv;
      void main() { vec3 c = texture2D(uT, vUv).rgb * 0.2270;
        c += (texture2D(uT, vUv + uD * 1.3846).rgb + texture2D(uT, vUv - uD * 1.3846).rgb) * 0.3162;
        c += (texture2D(uT, vUv + uD * 3.2308).rgb + texture2D(uT, vUv - uD * 3.2308).rgb) * 0.0703;
        gl_FragColor = vec4(c, 1.0); }` });
  const bgMat = new ShaderMaterial({ vertexShader: QV, depthTest: false, depthWrite: false,
    uniforms: { uT: { value: rtA.texture } },
    fragmentShader: "uniform sampler2D uT; varying vec2 vUv; void main() { gl_FragColor = vec4(texture2D(uT, vUv).rgb, 1.0); }" });
  const quadScene = new Scene(), quad = new Mesh(new PlaneGeometry(2, 2), blurMat);
  quad.frustumCulled = false;
  quadScene.add(quad);
  const bg = new Mesh(new PlaneGeometry(2, 2), bgMat);
  bg.frustumCulled = false;
  bg.renderOrder = -100;
  function buildHall(far) {
    hall.clear();
    const { floor: f, ceil: c, wall: w } = HALL, z0 = 0.002, zw = -WALLT;
    const add = (g) => { const m = new Mesh(g, hallMat); m.frustumCulled = false; hall.add(m); };
    add(plane([[-w, f, z0], [w, f, z0], [w, f, far], [-w, f, far]], [0, 1, 0]));
    add(plane([[-w, c, zw], [-w, c, far], [w, c, far], [w, c, zw]], [0, -1, 0]));
    add(plane([[-w, f, zw], [-w, f, far], [-w, c, far], [-w, c, zw]], [1, 0, 0]));
    add(plane([[w, f, zw], [w, c, zw], [w, c, far], [w, f, far]], [-1, 0, 0]));
    add(plane([[-w, f, far], [w, f, far], [w, c, far], [-w, c, far]], [0, 0, 1]));
  }
  /* the reveal: the jambs, in the stone of the pilasters (sampled from the facade: left pilaster u 0.236-0.30) */
  const jambMat = mat(FS_JAMB, { uTex: { value: null } });
  const jambs = new Group();
  scene.add(jambs);
  {
    const f = door.bot, t = door.top, z0 = 0.0, z1 = -WALLT, du = WALLT / WM;
    const v = (y) => G.hp[1] - y / HM;
    const L = [0.236, 0.298], R = [0.731, 0.669];
    const add = (g) => { const m = new Mesh(g, jambMat); m.frustumCulled = false; jambs.add(m); };
    add(plane([[-JAMB, f, z0], [-JAMB, t, z0], [-JAMB, t, z1], [-JAMB, f, z1]], [1, 0, 0],
      [[4, L[0], v(f)], [4, L[0], v(t)], [4, L[1], v(t)], [4, L[1], v(f)]]));
    add(plane([[JAMB, f, z0], [JAMB, f, z1], [JAMB, t, z1], [JAMB, t, z0]], [-1, 0, 0],
      [[4, R[0], v(f)], [4, R[1], v(f)], [4, R[1], v(t)], [4, R[0], v(t)]]));
  }
  const soffitMat = mat(FS_SOFFIT, Object.assign(plateU(), { uTex: { value: null }, uK: { value: 0 } }));
  {
    const m = new Mesh(plane([[-JAMB, door.top, 0], [-JAMB, door.top, -WALLT], [JAMB, door.top, -WALLT], [JAMB, door.top, 0]], [0, -1, 0]), soffitMat);
    m.frustumCulled = false;
    jambs.add(m);
  }

  /* the leaves */
  const leaves = {}, sideMats = {};
  const knobGeo = (() => {
    const pts = [[0.0001, 0], [0.037, 0], [0.0378, 0.002], [0.037, 0.0048], [0.013, 0.0068], [0.0092, 0.011], [0.0088, 0.033],
      [0.016, 0.0385], [0.027, 0.0435], [0.0338, 0.049], [0.0346, 0.0535], [0.0328, 0.0585], [0.0265, 0.0628], [0.016, 0.0655], [0.0001, 0.0664]];
    const g = new LatheGeometry(pts.map((p) => new Vector2(p[0], p[1])), 40);
    g.rotateX(Math.PI / 2);
    return withExtra(g, 0);
  })();
  const escGeo = (() => {
    const g = new LatheGeometry([[0.0001, 0], [1, 0], [1, 0.0022], [0.86, 0.0042], [0.0001, 0.0045]].map((p) => new Vector2(p[0], p[1])), 32);
    g.rotateX(Math.PI / 2);
    g.scale(ESC[2] * sc, ESC[3] * sc, 1);
    return withExtra(g, 0);
  })();
  for (const s of ["l", "r"]) {
    const rect = s === "l" ? rectOf(G.door[0], G.door[1], G.gap[0], G.door[3]) : rectOf(G.gap[1], G.door[1], G.door[2], G.door[3]);
    const wood = mat(FS_SOLID, solidU(rect)), brass = mat(FS_SOLID, solidU(rect));
    brass.uniforms.uMetal.value = 1;
    const pivot = new Group();
    pivot.position.set(s === "l" ? door.x0 : door.x1, 0, 0);
    const leaf = new Mesh(leafGeometry(s, leafW, leafH, door.top), wood);
    leaf.frustumCulled = false;
    pivot.add(leaf);
    const k = KNOB[s], kx = (s === "l" ? k[0] : k[0] - LPX) * sc, ky = door.top - k[1] * sc;
    const knob = new Mesh(knobGeo, brass);
    knob.position.set(kx, ky, 0);
    knob.frustumCulled = false;
    pivot.add(knob);
    let esc = null;
    if (s === "r") {
      esc = new Mesh(escGeo, mat(FS_SOLID, solidU(rect)));
      esc.material.uniforms.uMetal.value = 1;
      esc.position.set((ESC[0] - LPX) * sc, door.top - ESC[1] * sc, 0);
      esc.frustumCulled = false;
      pivot.add(esc);
    }
    scene.add(pivot);
    leaves[s] = { pivot, leaf, knob, esc, head: new Vector3(kx, ky, 0.051), rest: {} };
    sideMats[s] = [wood, brass].concat(esc ? [esc.material] : []);
  }
  /* hinge knuckles: brass barrels on the hinge line; they stay as the leaves swing (projected from the facade, or
     from the leaf where the facade is the doorway) */
  const hingeMats = [];
  for (const s of ["l", "r"]) {
    const rect = s === "l" ? rectOf(G.door[0], G.door[1], G.gap[0], G.door[3]) : rectOf(G.gap[1], G.door[1], G.door[2], G.door[3]);
    const m = mat(FS_SOLID, solidU(rect));
    m.uniforms.uMetal.value = 1;
    hingeMats.push(m);
    for (const [r0, r1] of HINGES) {
      const y0 = (G.hp[1] * MH - r1) / F2 * D, y1 = (G.hp[1] * MH - r0) / F2 * D;
      const g = withExtra(new CylinderGeometry(0.0072, 0.0072, y1 - y0, 16, 1), 0);
      const h = new Mesh(g, m);
      h.position.set(s === "l" ? door.x0 : door.x1, (y0 + y1) / 2, -0.004);
      h.frustumCulled = false;
      h.updateMatrix();
      h.updateMatrixWorld(true);
      scene.add(h);
    }
  }
  /* the facade plane, last (blended over the leaves at the doorway's anti-aliased edge, as the page draws it) */
  const facadeMat = mat(FS_FACADE, { uTex: { value: null }, uSpill: { value: null }, uSpillK: { value: 0 },
    uSpillR: { value: G.spill ? rectOf(G.spill[0], G.spill[1], G.spill[2], G.spill[3]) : new Vector4(0, 0, 1, 1) },
    uWall: { value: new Vector3() }, uOpenK: { value: 0 }, uDoorUV: { value: new Vector4(G.door[0], G.door[2], G.door[3], 0) },
    uDoorR: { value: new Vector4(G.door[0], G.door[1], G.door[2], G.door[3]) },
    uStrip: { value: null }, uSt: { value: new Vector4(2, 3, 0, 0) }, uWallLut: { value: null }, uWL: { value: new Vector2(0, 1) },
    uBelow: { value: new Vector3() },
    uLa: { value: [new Vector4(), new Vector4()] }, uLb: { value: [new Vector4(1, 1, 0, 0), new Vector4(1, 1, 0, 0)] },
    uLg: { value: [new Vector3(), new Vector3()] },
    uNotch: { value: new Vector4(NOTCH[0] / MW, NOTCH[1] / MW, NOTCH[2] / MH, NOTCH[3] / MH) }, uBias: { value: BIAS } },
    { transparent: true, blending: NormalBlending, depthWrite: false });
  const facade = new Mesh(plane([[-200, -200, 0], [200, -200, 0], [200, 200, 0], [-200, 200, 0]], [0, 0, 1]), facadeMat);
  facade.frustumCulled = false;
  facade.renderOrder = 10;
  scene.add(facade);

  /* rest matrices (the photograph's pose) */
  function pose(u) {
    const a = (G.open || 84) * Math.PI / 180 * u;
    leaves.l.pivot.rotation.y = a;
    leaves.r.pivot.rotation.y = -a;
    scene.updateMatrixWorld(true);
  }
  pose(0);
  const rest = new Map();
  scene.traverse((o) => { if (o.isMesh) rest.set(o, o.matrixWorld.clone()); });
  const headW = { l: new Vector4(), r: new Vector4() }, headR = { l: new Vector4(), r: new Vector4() };
  for (const s of ["l", "r"]) {
    const p = leaves[s].head.clone().applyMatrix4(leaves[s].pivot.matrixWorld);
    headR[s].set(p.x, p.y, p.z, 0.031);
  }
  /* where the photograph saw each brass part head-on (see uMean): the knob's cap, the escutcheon's plate, the hinge
     barrel's axis */
  const uvOf = (r, x, y, z) => { const k = D / (D - z); return [(G.hp[0] + x * k / WM - r.x) / r.z, (G.hp[1] - y * k / HM - r.y) / r.w]; };
  for (const s of ["l", "r"]) {
    const m = sideMats[s][1].uniforms, c = uvOf(m.uRect.value, headR[s].x, headR[s].y, 0.066);
    m.uMean.value.set(c[0], c[1], 0, 0);
    if (leaves[s].esc) {
      const e = leaves[s].esc.position, me = sideMats[s][2].uniforms, ce = uvOf(me.uRect.value, door.x1 + e.x, e.y, 0.004);
      me.uMean.value.set(ce[0], ce[1], 0, 0);
    }
  }
  hingeMats[0].uniforms.uMean.value.set(door.x0 + 0.003, 0, 1, 0);
  hingeMats[1].uniforms.uMean.value.set(door.x1 - 0.003, 0, 1, 0);

  /* the street round the photograph, for theme t (G.st, photo.py): the wall's stops, the strip, the colour below it,
     the lights; with no data (an old page) the plane keeps the flat wall colour */
  function street(t, img) {
    const u = facadeMat.uniforms, S = G.st && G.st[t];
    if (textures.street) { textures.street.dispose(); delete textures.street; }
    if (textures.wall) { textures.wall.dispose(); delete textures.wall; }
    const W0 = u.uWall.value, stops = S ? S.wall : [[0, W0.x, W0.y, W0.z], [1, W0.x, W0.y, W0.z]];
    /* the wall's stops as a 256 x 1 lookup, linear between stops as the page's gradient (8-bit, like its stops) */
    const y0 = stops[0][0], y1 = Math.max(stops[stops.length - 1][0], y0 + 1e-3), cv = document.createElement("canvas");
    cv.width = 256; cv.height = 1;
    const cx = cv.getContext("2d"), im = cx.createImageData(256, 1);
    for (let i = 0, j = 0; i < 256; i++) {
      const y = y0 + (y1 - y0) * i / 255;
      while (j < stops.length - 2 && y > stops[j + 1][0]) j++;
      const a = stops[j], b = stops[Math.min(j + 1, stops.length - 1)], k = b[0] > a[0] ? Math.min(1, Math.max(0, (y - a[0]) / (b[0] - a[0]))) : 0;
      for (let c = 0; c < 3; c++) im.data[i * 4 + c] = Math.round((a[c + 1] + (b[c + 1] - a[c + 1]) * k) * 255);
      im.data[i * 4 + 3] = 255;
    }
    cx.putImageData(im, 0, 0);
    const lt = new Texture(cv);
    lt.flipY = false; lt.generateMipmaps = false; lt.minFilter = lt.magFilter = LinearFilter; lt.wrapS = lt.wrapT = ClampToEdgeWrapping; lt.needsUpdate = true;
    textures.wall = lt;
    u.uWallLut.value = lt;
    u.uWL.value.set(y0, y1);
    if (!S) { u.uBelow.value.copy(W0); u.uSt.value.set(2, 3, 0, 0); for (let i = 0; i < 2; i++) u.uLa.value[i].set(0, 0, 0, 0); return; }
    u.uBelow.value.set(S.below[0], S.below[1], S.below[2]);
    for (let i = 0; i < 2; i++) {
      const L = S.lights[i];
      if (L) { u.uLa.value[i].set(L[0], L[1], L[2], L[2] * L[3]); u.uLb.value[i].set(L[4], L[8], 0, 0); u.uLg.value[i].set(L[5], L[6], L[7]); }
      else u.uLa.value[i].set(0, 0, 0, 0);
    }
    if (img) {
      const tx = tex(img);
      tx.wrapS = 1000;                          /* RepeatWrapping (not in the vendored subset): one tile a period, as the page */
      tx.anisotropy = 1;                        /* the facade plane faces the camera all the way in: no oblique view */
      textures.street = tx;
      u.uStrip.value = tx;
      u.uSt.value.set(G.st.y[0], G.st.y[1], 1, img.period || 1);
    } else u.uSt.value.set(G.st.y[0], G.st.y[1], 0, 1);
  }
  let theme = null, ready = false, lastSize = "", wallC = new Color();
  const textures = {};
  function setTheme(t, imgs) {
    const P = THEMES[t];
    theme = t;
    for (const k of Object.keys(textures)) { if (textures[k]) textures[k].dispose(); delete textures[k]; }
    for (const k of ["facade", "leafL", "leafR", "plate", "reveal", "spill"]) if (imgs[k]) {
      textures[k] = tex(imgs[k]);
      /* the hall's plate isotropic: seen from inside, its LOD must follow the larger footprint (see uSoft) */
      textures[k].anisotropy = k === "plate" || k === "reveal" ? 1 : maxAniso;
    }
    buildHall(P.far);
    for (const m of [hallMat, soffitMat]) { m.uniforms.uPlate.value = textures.plate; m.uniforms.uReveal.value = textures.reveal; }
    hallMat.uniforms.uSunK.value = P.sunK; hallMat.uniforms.uLeafW.value = leafW;
    soffitMat.uniforms.uTex.value = textures.facade;
    jambMat.uniforms.uTex.value = textures.facade;
    facadeMat.uniforms.uTex.value = textures.facade;
    facadeMat.uniforms.uSpill.value = textures.spill || null;
    facadeMat.uniforms.uWall.value.set(P.wall[0] / 255, P.wall[1] / 255, P.wall[2] / 255);
    street(t, imgs.street);
    wallC.setRGB(P.wall[0] / 255, P.wall[1] / 255, P.wall[2] / 255);
    renderer.setClearColor(wallC, 1);
    for (const s of ["l", "r"]) for (const m of sideMats[s]) m.uniforms.uTex.value = s === "l" ? textures.leafL : textures.leafR;
    {                                     /* the mip level that averages each brass part (leaf px -> texture px) */
      const k = (imgs.leafL ? imgs.leafL.width : LPX) / LPX, lv = (px) => Math.max(0, Math.log2(Math.max(1, px * k)));
      for (const s of ["l", "r"]) { sideMats[s][1].uniforms.uMean.value.w = lv(10); if (sideMats[s][2]) sideMats[s][2].uniforms.uMean.value.w = lv(5); }
      for (const m of hingeMats) m.uniforms.uMean.value.w = lv(2);
    }
    hingeMats[0].uniforms.uTex.value = textures.leafL;
    hingeMats[1].uniforms.uTex.value = textures.leafR;
    for (const m of mats) {
      const u = m.uniforms;
      u.uSunDir.value.copy(P.sunDir);
      u.uSun.value.set(...P.sun);
      u.uSky.value.set(...P.sky);
      u.uHall.value.set(...P.hall);
      u.uLampOn.value = P.lampOn;
      if (u.uMetal) {
        u.uMaxM.value = P.maxM; u.uMinM.value = P.minM;
        u.uSpec.value = u.uMetal.value ? (t === "dia" ? 0.55 : 0.4) : P.spec;
        u.uEnvTop.value.set(...P.env.top); u.uEnvHor.value.set(...P.env.hor); u.uEnvLow.value.set(...P.env.low); u.uEnvIn.value.set(...P.env.in);
      }
    }
    ready = true;
  }
  /* uMRest is per mesh, but materials are shared (leaf wood per side, hall): set it per draw */
  const IDENT = new Matrix4();
  function track(o) { o.onBeforeRender = function (r, s, c, g, m) { m.uniforms.uMRest.value = rest.get(o) || IDENT; m.uniformsNeedUpdate = true; }; }
  scene.traverse((o) => { if (o.isMesh) track(o); });

  const proj = new Matrix4(), view = new Matrix4();
  /* v: { cw, ch: canvas CSS size; rect: {x, y, w, h} the scene's rest box on the canvas; tx, ty: pan; zc: camera
     distance in rest units; u: the doors' opening, 0..1; spill: Noite lamplight 0..1 } */
  function frame(v) {
    if (!ready) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, opt.maxDpr || MAXDPR), key = v.cw + "x" + v.ch + "@" + dpr;
    if (key !== lastSize) { renderer.setPixelRatio(dpr); renderer.setSize(v.cw, v.ch, false); lastSize = key; }
    pose(v.u);
    const zc = v.zc * D, f = D * v.rect.w / WM * (v.s ? v.s * v.zc : 1), n = 0.02, far = 60;
    const px = v.rect.x + G.hp[0] * v.rect.w + v.tx, py = v.rect.y + G.hp[1] * v.rect.h + v.ty;
    proj.makePerspective(-px * n / f, (v.cw - px) * n / f, py * n / f, -(v.ch - py) * n / f, n, far);
    camera.projectionMatrix.copy(proj);
    camera.projectionMatrixInverse.copy(proj).invert();
    camera.matrixWorld.makeTranslation(0, 0, zc);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    for (const s of ["l", "r"]) {
      const p = leaves[s].head.clone().applyMatrix4(leaves[s].pivot.matrixWorld);
      headW[s].set(p.x, p.y, p.z, 0.031);
      for (const m of sideMats[s]) m.uniforms.uCam.value.set(0, 0, zc);
      const ok = Math.min(1, v.u * 12), rk = ok * (theme === "dia" ? 6 : 3) / LPX, G0 = THEMES[theme].gapGlow;
      sideMats[s][0].uniforms.uGap.value.set(s === "l" ? gap.l : gap.r, s === "l" ? -1 : 1, G0, 0.0055);
      sideMats[s][0].uniforms.uGapNow.value = 1 - ok;
      sideMats[s][0].uniforms.uClampX.value.set(s === "l" ? 0 : rk, s === "l" ? 1 - rk : 1);
      sideMats[s][0].uniforms.uKnob.value.copy(headW[s]);
      sideMats[s][0].uniforms.uKnob0.value.copy(headR[s]);
    }
    for (const m of hingeMats) m.uniforms.uCam.value.set(0, 0, zc);
    const ok3 = Math.min(1, v.u * 3);
    hallMat.uniforms.uOpen.value = (G.open || 84) * Math.PI / 180 * v.u;
    hallMat.uniforms.uOpenK.value = ok3;
    soffitMat.uniforms.uK.value = ok3 * ok3 * (3 - 2 * ok3);
    facadeMat.uniforms.uSpillK.value = theme === "noite" ? (v.spill || 0) : 0;
    facadeMat.uniforms.uOpenK.value = ok3;
    /* the lens stays on the door: as the camera walks in, the hall (already the plate's defocus, magnified) goes
       softer still, up to P.blur CSS px (sigma) once the camera nears the door plane */
    const fz = Math.min(1, Math.max(0, (1 - v.zc) / 0.6)), P = THEMES[theme], ez = fz * fz * (3 - 2 * fz), sig = P.blur * ez;
    hallMat.uniforms.uSoft.value = 3.0 * ez;
    if (sig < 0.05) {                 /* near rest: the plate as it is, full size */
      if (bg.parent) scene.remove(bg);
      renderer.autoClear = true;
      renderer.setRenderTarget(null);
      renderer.render(sceneH, camera);
      renderer.autoClear = false;
      renderer.clearDepth();
      renderer.render(scene, camera);
      renderer.autoClear = true;
    } else {
      const bw = Math.max(1, Math.round(v.cw * dpr / 2)), bh = Math.max(1, Math.round(v.ch * dpr / 2));
      if (rtA.width !== bw || rtA.height !== bh) { rtA.setSize(bw, bh); rtB.setSize(bw, bh); }
      renderer.setRenderTarget(rtA);
      renderer.render(sceneH, camera);
      /* the lens (never on the door): the separable kernel has sigma 1.64 r; wide radii are split into up to three
         passes of r <= 2.1 so its taps never leave gaps (sigma adds in quadrature) */
      const sh = sig * dpr / 2, it = Math.min(3, Math.max(1, Math.ceil(Math.pow(sh / (1.64 * 2.1), 2)))), r = sh / (1.64 * Math.sqrt(it));
      quad.material = blurMat;
      for (let i = 0; i < it; i++) {
        blurMat.uniforms.uT.value = rtA.texture; blurMat.uniforms.uD.value.set(r / bw, 0);
        renderer.setRenderTarget(rtB); renderer.render(quadScene, camera);
        blurMat.uniforms.uT.value = rtB.texture; blurMat.uniforms.uD.value.set(0, r / bh);
        renderer.setRenderTarget(rtA); renderer.render(quadScene, camera);
      }
      renderer.setRenderTarget(null);
      if (!bg.parent) scene.add(bg);
      renderer.render(scene, camera);
    }
    return true;
  }
  /* the camera distance (rest units) at which the hall's far arch of light fills the canvas */
  function endZ(v) {
    const f = D * v.rect.w / WM, far = THEMES[theme || "dia"].far, k = (D - far) / D,
      L = [G.light[0] * WM * k, G.light[1] * HM * k, Math.min(G.light[2] * HM * k, -HALL.floor)];
    const d = Math.min(f * L[0] / (v.cw / 2), f * L[1] / (v.ch / 2), f * L[2] / (v.ch / 2)) * 0.85;
    return (far + d) / D;
  }
  function dispose() {
    for (const k of Object.keys(textures)) if (textures[k]) textures[k].dispose();
    renderer.dispose();
  }
  /* the first frame's work, done ahead in small tasks (each after pause(): the page still, at idle; the canvas
     hidden): each texture's upload on its own, the programs compiled in parallel where the driver can
     (KHR_parallel_shader_compile), then one frame per view */
  async function warm(views, pause) {
    for (const k of Object.keys(textures)) { if (textures[k]) { await pause(); if (textures[k]) renderer.initTexture(textures[k]); } }
    pose(0);
    const par = renderer.extensions.has("KHR_parallel_shader_compile");
    try {
      if (par) { await renderer.compileAsync(sceneH, camera); await pause(); await renderer.compileAsync(scene, camera); }
      else { renderer.compile(sceneH, camera); await pause(); renderer.compile(scene, camera); }
    } catch (e) {}
    for (const v of views) { await pause(); frame(v); }
  }
  return { setTheme, frame, endZ, warm, dispose, renderer, scene, sceneH, get theme() { return theme; }, get ready() { return ready; } };
}

/* ---------------------------------------------------------------- the page (site.js loads this module lazily)
   mount() puts a canvas in the pinned stage (under the text, over the photograph) and keeps a theme's textures: the
   photograph's own layers, the very files the page's pictures pick (the facade and the leaves at the sizes the page
   already fetched for the walk-in, the hall plate, the doorway's shade and the lamplight at the size shown). No
   texture is resized: the facade is the 2388 x 2634 master the page already holds for the walk-in (resizing it to
   2048 cost a 370 ms main-thread task at 4x CPU throttle and saved no byte); anything larger than 4096 px would be
   scaled down. Each file is decoded off the main thread (createImageBitmap from its bytes, from the HTTP cache: one
   made from the page's <img> re-decoded the master on the main thread, 126 ms at 4x throttle, review r1), then
   uploaded, compiled and drawn once in small steps, each taken only while the page is still (env.quiet: no scroll
   being followed, no flight) and at idle, so none lands in a gesture; the decoded copies are let go once on the GPU.
   A theme change does the same for the new theme; until it is done, draw() answers false and the page keeps its CSS
   entrance. A lost context ends this mount: the canvas goes, the page goes on with its CSS entrance (onLost) and may
   mount again later (site.js). */
const MAXTEX = 4096;
export function mount(env) {
  const canvas = document.createElement("canvas");
  canvas.className = "porta__3d";
  canvas.setAttribute("aria-hidden", "true");
  env.stage.insertBefore(canvas, env.stage.firstChild);
  let core;
  try { core = create(canvas, env.G, { force: env.force }); } catch (e) { canvas.remove(); throw e; }
  let dead = false, have = null, want = null;
  const cache = {}, root = document.documentElement;
  canvas.addEventListener("webglcontextlost", function () { dead = true; canvas.remove(); if (env.onLost) env.onLost(); }, false);
  const idle = (f) => (window.requestIdleCallback ? requestIdleCallback(f, { timeout: 500 }) : setTimeout(f, 16));
  const still = () => !env.quiet || env.quiet();
  /* the next step: once the page is still, at idle (and still then) */
  const pause = () => new Promise((ok) => {
    (function w() { if (dead) return ok(); if (!still()) return setTimeout(w, 120); idle(() => (dead || still() ? ok() : setTimeout(w, 120))); })();
  });
  const loaded = (im) => (im.complete && im.naturalWidth ? Promise.resolve(im)
    : new Promise((ok, no) => { im.addEventListener("load", () => ok(im), { once: true }); im.addEventListener("error", no, { once: true }); }));
  async function bitmap(url) {
    const o = { premultiplyAlpha: "none", colorSpaceConversion: "none" };
    if (window.createImageBitmap && window.fetch) {
      try {
        let bm = await createImageBitmap(await (await fetch(url)).blob(), o);
        const k = Math.min(1, MAXTEX / Math.max(bm.width, bm.height));
        if (k < 1) { const r = await createImageBitmap(bm, Object.assign({ resizeWidth: Math.round(bm.width * k), resizeHeight: Math.round(bm.height * k), resizeQuality: "high" }, o)); bm.close(); bm = r; }
        return bm;
      } catch (e) {}
    }
    const j = new Image();                /* detached, no size attributes: its width is its natural width */
    j.src = url;
    await loaded(j);
    if (j.decode) await j.decode().catch(() => {});
    return j;
  }
  /* the file a picture picks (for the walk-in: its sizes at 3x the scene, as the page does once the run starts) */
  function pic(sel, t, big) {
    const p = env.scene.querySelector(sel + " picture.t-" + t);
    if (!p) return Promise.resolve(null);
    let im = p.querySelector("img");
    if (big || !(im.complete && im.naturalWidth)) {
      /* a detached copy (its own sizes, fetched at once): the same files the page asks for, from the cache */
      const c = p.cloneNode(true), v = big ? env.big() : null;
      im = c.querySelector("img");
      if (v) for (const e of c.querySelectorAll("source, img")) e.setAttribute("sizes", v);
      im.setAttribute("loading", "eager");
    }
    return loaded(im).then(() => bitmap(im.currentSrc || im.src));
  }
  /* the paving strip the page's stylesheet picked, its density and its width (one scene width on an upright phone,
     three elsewhere: read from the street's computed background, so it comes from the cache), for either theme; AVIF
     where it decodes, else WebP; null if there is none. The bitmap carries its period in facade widths. */
  function strip(t) {
    const S = env.G.st && env.G.st[t], el = env.scene.querySelector(".ph--street");
    if (!S || !el) return Promise.resolve(null);
    const m = /street(3?)-(\d+)\.(avif|webp)/.exec(getComputedStyle(el).backgroundImage || ""),
      set = m && m[1] && S.src3 && S.src3[m[2]] ? S.src3 : S.src, ws = Object.keys(set);
    const w = m && set[m[2]] ? m[2] : ws[Math.min(1, ws.length - 1)], base = set[w], n = set === S.src ? 1 : 3;
    const tag = (b) => { if (b) b.period = n; return b; };
    return bitmap(base + ".avif").catch(() => bitmap(base + ".webp")).then(tag).catch(() => null);
  }
  function load(t) {
    if (cache[t]) return cache[t];
    const want = { facade: pic(".ph--facade", t, 1), leafL: pic(".leaf--l", t, 1), leafR: pic(".leaf--r", t, 1),
      plate: pic(".ph--plate", t, 0), reveal: pic(".ph--reveal", t, 0), spill: t === "noite" ? pic(".ph--spill", t, 0) : Promise.resolve(null),
      street: strip(t) };
    const keys = Object.keys(want);
    cache[t] = Promise.all(keys.map((k) => want[k])).then((v) => { const o = {}; keys.forEach((k, i) => { o[k] = v[i]; }); return o; });
    cache[t].catch(() => { delete cache[t]; });
    return cache[t];
  }
  const drop = (t) => { const c = cache[t]; if (!c) return; delete cache[t]; c.then((o) => { for (const v of Object.values(o)) if (v && v.close) v.close(); }, () => {}); };
  function use(t) {
    want = t;
    return load(t).then(async (imgs) => {
      if (dead || want !== t) { if (want !== t) drop(t); return; }
      have = null;                        /* draw() answers false until the new theme is on the GPU */
      core.setTheme(t, imgs);
      await core.warm(env.views ? env.views(core.endZ) : [], pause);
      if (dead || want !== t) return;
      drop(t);                            /* uploaded: the decoded copies go (a later change decodes again, from the cache) */
      have = t;
      if (env.onTheme) env.onTheme(t);
    });
  }
  const mo = new MutationObserver(function () { const t = env.theme(); if (t !== have && t !== want) use(t).catch(() => {}); });
  mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  return {
    ready: use(env.theme()),
    canvas,
    get ok() { return !dead && have === env.theme(); },
    endZ: (v) => core.endZ(v),
    /* draws the frame; false when it cannot (no context, or the theme's textures are not in yet) */
    draw(v) { if (dead || have !== env.theme()) return false; try { return core.frame(v); } catch (e) { return false; } },
    destroy() { mo.disconnect(); dead = true; for (const k of Object.keys(cache)) drop(k); core.dispose(); canvas.remove(); }
  };
}
if (typeof document !== "undefined" && document.currentScript === null && typeof window !== "undefined") {
  document.documentElement.__door3d = { mount };
  window.dispatchEvent(new Event("door3d"));
}
