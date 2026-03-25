export const FracturePolyShader = `
uniform float2 iResolution;
uniform float iTime;

float cross2d(vec2 a, vec2 b) {
    return a.x * b.y - a.y * b.x;
}

float edgeAA(float a, vec2 R) {
    return smoothstep(2.0 / R.y, -2.0 / R.y, a);
}

float sat(float x) {
    return clamp(x, 0.0, 1.0);
}

float softSignLike(float x) {
    return x / (1.0 + abs(x));
}

float h11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

vec2 h21(float p) {
    vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

float texLike(vec2 uv) {
    vec2 g = floor(uv * 18.0);
    float a = h11(g.x + g.y * 37.0);
    float b = h11(g.x * 13.0 + g.y * 57.0 + 19.0);
    return mix(a, b, 0.5);
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}

half4 main(vec2 fragCoord) {
    vec2 R = iResolution.xy;
    vec2 u = (fragCoord + fragCoord - R) / R.y;

    float t = iTime / 6.0;
    float sx = softSignLike(iTime * 1.2);
    vec2 p = vec2(sx * R.x / R.y, 1.0) - vec2(0.12, 0.12);

    // base frame from original composition
    float frame = sdBox(u, p);

    // iterative fracture planes
    float id = 0.0;
    float keep = 1.0;
    float dCuts = 1e5;

    vec2 center = vec2(0.0);

    for (int k = 1; k <= 8; k++) {
        float fi = float(k);

        // moving split center
        vec2 jitter = h21(fi * 11.7 + floor(t * 0.7)) - 0.5;
        center = jitter * p * 0.55;

        float signFlip = h11(id + fi * 3.1) > 0.5 ? 1.0 : -1.0;
        float a = 1.5 * t * signFlip + fi * 0.73;
        vec2 dir = vec2(cos(a), sin(a));

        float side = cross2d(u - center, dir);
        float cutDist = abs(side);

        dCuts = min(dCuts, cutDist);

        if (side > 0.0) {
            id += 1.0 / fi;
        } else {
            id -= 1.0 / fi;
        }

        t += 100.0 * (h11(id) - 0.5);

        float tx = texLike(u / 9.0 + fi * 0.013);
        float survive = step(0.1, h11(id + floor(t / 1.5 - tx / 8.0)));

        keep *= mix(step(0.0, side), step(side, 0.0), step(0.5, h11(fi + id * 2.0)));
        keep *= survive;
    }

    float d1 = max(frame, -keep + 0.001);
    float d2 = d1 + 0.08;

    float h = h11(id);

    vec4 col;
    if (h < 0.25) {
        col = vec4(70.0, 83.0, 98.0, 0.0);
    } else if (h < 0.50) {
        col = vec4(130.0, 163.0, 162.0, 0.0);
    } else if (h < 0.75) {
        col = vec4(159.0, 196.0, 144.0, 0.0);
    } else {
        col = vec4(192.0, 223.0, 161.0, 0.0);
    }
    col /= 255.0;

    vec4 bg = vec4(0.792, 0.918, 0.667, 1.0);
    vec4 o = bg;

    float crack = edgeAA(dCuts - 0.01, R);
    o = mix(o, vec4(1.0), crack * 0.35);

    o = mix(o, mix(col, vec4(1.0), h11(id + 100.0)), edgeAA(abs(d1 + 0.015) - 0.0075, R));
    o = mix(o, col, edgeAA(d1 + 0.03, R));
    o *= 0.95 + 0.1 * edgeAA(d2, R);

    float vignBase = 5.0 * (u.x - p.x) * (u.x + p.x) * (u.y - p.y) * (u.y + p.y);
    float vign = pow(sat(softSignLike(vignBase) * 0.5 + 0.5), 0.03);
    o = mix(bg, o, vign);

    return half4(o);
}
`;
