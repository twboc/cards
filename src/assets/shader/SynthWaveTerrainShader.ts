export const SynthwaveTerrainShader = `
uniform float2 iResolution;
uniform float iTime;

float amp1(float x) {
    return smoothstep(1.0, 8.0, abs(x));
}

float pow512(float a) {
    a *= a;
    a *= a;
    a *= a;
    a *= a;
    a *= a;
    a *= a;
    a *= a;
    a *= a;
    return a * a;
}

float pow1d5(float a) {
    return a * sqrt(max(a, 0.0));
}

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(1.9898, 7.233))) * 45758.5433);
}

float hashTerrain(vec2 uv, float t) {
    float a = amp1(uv.x);
    if (a <= 0.0) {
        return 0.0;
    }

    float wave = 1.0 - 0.4 * pow512(
        0.51 + 0.49 * sin((0.02 * (uv.y + 0.5 * uv.x) - t) * 2.0)
    );

    return a * pow1d5(hash21(uv)) * wave;
}

float edgeMin(float dx, vec2 da, vec2 db, vec2 uv) {
    vec2 q = uv;
    q.x += 5.0;

    float c0 = fract(floor(q.x + 0.5) * 0.61803398875);
    float c1 = fract(floor(q.y + 0.5) * 1.61803398875);
    float c2 = fract(floor(q.x + q.y + 0.5) * 2.61803398875);

    float a1 = hash21(vec2(c1, 0.13)) > 0.6 ? 0.15 : 1.0;
    float a2 = hash21(vec2(c0, 0.37)) > 0.6 ? 0.15 : 1.0;
    float a3 = hash21(vec2(c2, 0.73)) > 0.6 ? 0.15 : 1.0;

    float e1 = (1.0 - dx) * db.y * a3;
    float e2 = da.x * a2;
    float e3 = da.y * a1;
    return min(min(e1, e2), e3);
}

vec2 triNoise(vec2 uv, float t) {
    float sq = sqrt(3.0 / 2.0);

    vec2 p = uv;
    p.x *= sq;
    p.y -= 0.5 * p.x;

    vec2 d = fract(p);
    p -= d;

    float c = dot(d, vec2(1.0, 1.0)) > 1.0 ? 1.0 : 0.0;

    vec2 dd = vec2(1.0, 1.0) - d;
    vec2 da = mix(d, dd, c);
    vec2 db = mix(dd, d, c);

    float nn = hashTerrain(p + vec2(c, c), t);
    float n2 = hashTerrain(p + vec2(1.0, 0.0), t);
    float n3 = hashTerrain(p + vec2(0.0, 1.0), t);

    float nmid = mix(n2, n3, d.y);
    float nsOther = mix(n3, n2, c);
    float ns = mix(nn, nsOther, da.y);

    float dx = da.x / max(db.y, 0.0001);
    float edge = edgeMin(dx, da, db, p + d);

    return vec2(mix(ns, nmid, dx), edge);
}

vec2 mapTerrain(vec3 p, float t) {
    vec2 n = triNoise(vec2(p.x, p.z), t);
    return vec2(p.y - 2.0 * n.x, n.y);
}

vec3 gradTerrain(vec3 p, float t) {
    float e = 0.005;
    float a = mapTerrain(p, t).x;

    float gx = mapTerrain(vec3(p.x + e, p.y, p.z), t).x - a;
    float gy = mapTerrain(vec3(p.x, p.y + e, p.z), t).x - a;
    float gz = mapTerrain(vec3(p.x, p.y, p.z + e), t).x - a;

    return vec3(gx, gy, gz) / e;
}

vec2 intersectTerrain(vec3 ro, vec3 rd, float t) {
    float d = 0.0;
    float h = 0.0;
    float edge = 0.0;

    for (int i = 0; i < 120; i++) {
        vec3 p = ro + rd * d;
        vec2 s = mapTerrain(p, t);
        h = s.x;
        edge = s.y;
        d += h * 0.5;

        if (abs(h) < 0.003 * max(d, 1.0)) {
            return vec2(d, edge);
        }

        if (d > 150.0) {
            break;
        }
        if (p.y > 2.0) {
            break;
        }
    }

    return vec2(-1.0, -1.0);
}

float sunMask(vec3 rd, vec3 ld) {
    float sun = smoothstep(0.21, 0.2, distance(rd, ld));
    if (sun <= 0.0) {
        return 0.0;
    }

    float yd = rd.y - ld.y;
    float a = sin(3.1 * exp(-yd * 14.0));
    sun *= smoothstep(-0.8, 0.0, a);
    return sun;
}

float starNoise(vec3 rd) {
    float c = 0.0;
    vec3 p = normalize(rd) * 300.0;

    for (int i = 0; i < 4; i++) {
        vec3 q = fract(p) - vec3(0.5, 0.5, 0.5);
        vec3 id = floor(p);

        float c2 = smoothstep(0.5, 0.0, length(q));
        float denom = max(abs(id.y), 1.0);
        float gate = hash21(vec2(id.x / denom, id.z / denom));
        c2 *= step(gate, 0.06 - float(i * i) * 0.005);
        c += c2;

        vec3 rp = vec3(
            (3.0 / 5.0) * p.x + (4.0 / 5.0) * p.z,
            p.y,
            (-4.0 / 5.0) * p.x + (3.0 / 5.0) * p.z
        );

        p = p * 0.6 + 0.5 * rp;
    }

    c *= c;

    vec3 s1 = sin(rd * 10.512);
    vec3 c1 = cos(vec3(rd.y, rd.z, rd.x) * 10.512);
    float g = dot(s1, c1);

    c *= smoothstep(-3.14, -0.9, g) * 0.5 + 0.5 * smoothstep(-0.3, 1.0, g);
    return c * c;
}

vec3 getSky(vec3 rd, vec3 ld, float maskSky) {
    float haze = exp2(-5.0 * (abs(rd.y) - 0.2 * dot(rd, ld)));
    float stars = starNoise(rd) * (1.0 - min(haze, 1.0)) * maskSky;

    vec3 back = vec3(0.4, 0.1, 0.7);

    float denom = max(abs(rd.y), 0.05);
    float horizonGlow = exp2(-0.1 * abs(length(vec2(rd.x, rd.z)) / denom)) * max(sign(rd.y), 0.0);
    back *= 1.0 - 0.5 * horizonGlow * hash21(vec2(0.5 + 0.05 * rd.x / denom, 0.0));

    vec3 col = clamp(mix(back, vec3(0.7, 0.1, 0.4), haze) + stars, 0.0, 1.0);

    float sun = sunMask(rd, ld) * maskSky;
    col = mix(col, vec3(1.0, 0.8, 0.4) * 0.75, sun);

    return col;
}

half4 main(vec2 fragCoord) {
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    uv.y = -uv.y;

    float shutterSpeed = 0.25;
    float dt = fract(hash21(fragCoord) + iTime) * shutterSpeed;
    float fakeTimeDelta = 1.0 / 60.0;
    float localTime = mod(iTime - dt * fakeTimeDelta, 4000.0);

    vec3 ro = vec3(0.0, 1.0, -20000.0 + localTime * 10.0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 4.0 / 3.0));

    vec2 hit = intersectTerrain(ro, rd, localTime);
    float d = hit.x;

    vec3 ld = normalize(vec3(0.0, 0.125 + 0.05 * sin(0.1 * localTime), 1.0));

    float skyMask = d < 0.0 ? 1.0 : 0.0;
    vec3 sky = getSky(rd, ld, skyMask);
    vec3 col = sky;

    if (d > 0.0) {
        vec3 p = ro + rd * d;
        vec3 n = normalize(gradTerrain(p, localTime));

        float diff = dot(n, ld) + 0.1 * n.y;
        col = vec3(0.1, 0.11, 0.18) * diff;

        vec3 rfd = reflect(rd, n);
        vec3 rfcol = getSky(rfd, ld, 1.0);

        float fres = 0.05 + 0.95 * pow(max(1.0 + dot(rd, n), 0.0), 5.0);
        col = mix(col, rfcol, fres);
        col = mix(col, vec3(0.8, 0.1, 0.92), smoothstep(0.05, 0.0, hit.y));

        vec3 fog = exp2(-d * vec3(0.14, 0.1, 0.28));
        col = mix(sky, col, fog);
    }

    return half4(clamp(col, 0.0, 1.0), 1.0);
}
`;
