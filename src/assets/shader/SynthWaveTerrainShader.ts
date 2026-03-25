export const SynthwaveTerrainShader = `
uniform float2 iResolution;
uniform float iTime;

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float fastPow5(float x) {
    float x2 = x * x;
    return x2 * x2 * x;
}

float triHash(vec2 p) {
    return hash21(p);
}

float terrainNoise(vec2 uv, float t) {
    float ax = abs(uv.x);
    float a = smoothstep(1.0, 8.0, ax);
    if (a <= 0.0) return 0.0;

    float waveArg = (0.02 * (uv.y + 0.5 * uv.x) - t) * 2.0;
    float s = 0.51 + 0.49 * sin(waveArg);

    // cheaper replacement for pow512-based sharp gating
    float wave = 1.0 - 0.4 * fastPow5(s);

    float h = triHash(uv);
    h = h * sqrt(max(h, 0.0));

    return a * h * wave;
}

vec2 triNoise(vec2 uv, float t) {
    const float sq = 1.22474487139; // sqrt(3/2)

    vec2 p = uv;
    p.x *= sq;
    p.y -= 0.5 * p.x;

    vec2 f = fract(p);
    p -= f;

    float c = step(1.0, f.x + f.y);
    vec2 ff = mix(f, 1.0 - f, c);
    vec2 gg = mix(1.0 - f, f, c);

    float n0 = terrainNoise(p + vec2(c), t);
    float n1 = terrainNoise(p + vec2(1.0, 0.0), t);
    float n2 = terrainNoise(p + vec2(0.0, 1.0), t);

    float blendA = mix(n0, mix(n2, n1, c), ff.y);
    float blendB = mix(n1, n2, f.y);

    float dx = ff.x / max(gg.y, 0.0001);

    // simplified edge estimate
    float edge = min(min((1.0 - dx) * gg.y, ff.x), ff.y);

    return vec2(mix(blendA, blendB, dx), edge);
}

vec2 mapTerrain(vec3 p, float t) {
    vec2 n = triNoise(p.xz, t);
    return vec2(p.y - 2.0 * n.x, n.y);
}

vec3 gradTerrainFast(vec3 p, float t) {
    float e = 0.01;
    float h = mapTerrain(p, t).x;
    float hx = mapTerrain(vec3(p.x + e, p.y, p.z), t).x - h;
    float hz = mapTerrain(vec3(p.x, p.y, p.z + e), t).x - h;

    // keep terrain normal stable with an upward bias
    return normalize(vec3(hx, e * 1.6, hz));
}

vec2 intersectTerrain(vec3 ro, vec3 rd, float t) {
    float d = 0.0;
    float edge = 0.0;

    for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * d;
        vec2 s = mapTerrain(p, t);

        float h = s.x;
        edge = s.y;

        d += h * 0.55;

        if (abs(h) < 0.004 * max(d, 1.0)) {
            return vec2(d, edge);
        }

        if (d > 120.0 || p.y > 2.0) {
            break;
        }
    }

    return vec2(-1.0, -1.0);
}

float sunMask(vec3 rd, vec3 ld) {
    float sun = smoothstep(0.21, 0.2, distance(rd, ld));
    if (sun <= 0.0) return 0.0;

    float yd = rd.y - ld.y;
    float a = sin(3.1 * exp(-yd * 14.0));
    return sun * smoothstep(-0.8, 0.0, a);
}

float starNoiseFast(vec3 rd) {
    vec3 n = normalize(rd);
    vec2 suv = n.xz / max(abs(n.y) + 0.35, 0.35);
    vec2 cell = floor(suv * 28.0);
    float h = hash21(cell);

    float star = step(0.985, h);
    star *= smoothstep(1.0, 0.2, abs(n.y));

    return star * star;
}

vec3 getSky(vec3 rd, vec3 ld, float maskSky) {
    float haze = exp2(-5.0 * (abs(rd.y) - 0.2 * dot(rd, ld)));
    float stars = starNoiseFast(rd) * (1.0 - min(haze, 1.0)) * maskSky;

    vec3 back = vec3(0.4, 0.1, 0.7);
    vec3 horizon = vec3(0.7, 0.1, 0.4);

    float denom = max(abs(rd.y), 0.08);
    float horizonGlow = exp2(-0.1 * abs(length(rd.xz) / denom)) * max(sign(rd.y), 0.0);
    back *= 1.0 - 0.35 * horizonGlow;

    vec3 col = clamp(mix(back, horizon, haze) + stars, 0.0, 1.0);

    float sun = sunMask(rd, ld) * maskSky;
    col = mix(col, vec3(1.0, 0.8, 0.4) * 0.75, sun);

    return col;
}

half4 main(vec2 fragCoord) {
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    uv.y = -uv.y;

    float t = mod(iTime, 4000.0);

    vec3 ro = vec3(0.0, 1.0, -20000.0 + t * 10.0);
    vec3 rd = normalize(vec3(uv, 1.3333333));

    vec2 hit = intersectTerrain(ro, rd, t);
    float d = hit.x;

    vec3 ld = normalize(vec3(0.0, 0.125 + 0.05 * sin(0.1 * t), 1.0));

    float skyMask = step(d, -0.5);
    vec3 sky = getSky(rd, ld, skyMask);
    vec3 col = sky;

    if (d > 0.0) {
        vec3 p = ro + rd * d;
        vec3 n = gradTerrainFast(p, t);

        float diff = max(dot(n, ld) + 0.1 * n.y, 0.0);
        col = vec3(0.1, 0.11, 0.18) * diff;

        vec3 rfd = reflect(rd, n);
        vec3 rfcol = getSky(rfd, ld, 1.0);

        float fresBase = max(1.0 + dot(rd, n), 0.0);
        float fres = 0.05 + 0.95 * fastPow5(fresBase);

        col = mix(col, rfcol, fres);
        col = mix(col, vec3(0.8, 0.1, 0.92), smoothstep(0.05, 0.0, hit.y));

        vec3 fog = exp2(-d * vec3(0.14, 0.1, 0.28));
        col = mix(sky, col, fog);
    }

    return half4(clamp(col, 0.0, 1.0), 1.0);
}
`;
