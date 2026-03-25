const KanagawaWaveShader = `
uniform float2 iResolution;
uniform float iTime;

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float sdLine(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float waveBand(vec2 uv, float y, float amp, float freq, float speed, float phase) {
    float n = fbm(vec2(uv.x * 1.4 + phase, uv.y * 2.0));
    float line =
        y +
        sin(uv.x * freq + iTime * speed + phase) * amp +
        sin(uv.x * (freq * 0.47) - iTime * speed * 0.6) * amp * 0.55 +
        (n - 0.5) * amp * 0.7;
    return uv.y - line;
}

float crestFoam(vec2 uv, float y, float amp, float freq, float speed, float phase) {
    float band = waveBand(uv, y, amp, freq, speed, phase);
    float edge = 1.0 - smoothstep(0.0, 0.015, abs(band));

    float chop =
        sin(uv.x * 38.0 - iTime * 2.4 + phase * 3.0) *
        sin(uv.x * 13.0 + iTime * 1.7);

    float detail = smoothstep(0.15, 0.95, fbm(uv * 9.0 + vec2(iTime * 0.4, -iTime * 0.2)));
    return edge * smoothstep(-0.2, 0.7, chop + detail);
}

float bigCurl(vec2 uv) {
    vec2 p = uv;
    p -= vec2(-0.28, 0.08);

    float radius = 0.33;
    float ring = abs(length(p) - radius);

    float angle = atan(p.y, p.x);
    float arcMask = smoothstep(2.9, 2.1, angle) * smoothstep(-1.8, -0.1, angle);

    float wobble =
        sin(angle * 8.0 - iTime * 1.1) * 0.012 +
        sin(angle * 17.0 + iTime * 1.7) * 0.006;

    return 1.0 - smoothstep(0.016 + wobble, 0.05 + wobble, ring) * arcMask;
}

float clawFoam(vec2 uv, vec2 center, float scale, float seed) {
    vec2 p = (uv - center) / scale;

    float d1 = sdCircle(p - vec2(0.00, 0.00), 0.16);
    float d2 = sdCircle(p - vec2(0.18, 0.08), 0.12);
    float d3 = sdCircle(p - vec2(-0.16, 0.10), 0.11);
    float d4 = sdCircle(p - vec2(0.33, 0.18), 0.08);

    float d = min(min(d1, d2), min(d3, d4));
    float shape = 1.0 - smoothstep(0.0, 0.06, d);

    float flicker = 0.75 + 0.25 * sin(iTime * 2.5 + seed);
    return shape * flicker;
}

float spray(vec2 uv) {
    vec2 p = uv * vec2(30.0, 24.0);
    p.x += iTime * 1.2;

    vec2 id = floor(p);
    vec2 gv = fract(p) - 0.5;

    float rnd = hash21(id);
    vec2 offset = vec2(rnd - 0.5, hash21(id + 17.0) - 0.5) * 0.7;

    float d = length(gv - offset);
    float particle = 1.0 - smoothstep(0.02, 0.08, d);

    float region =
        smoothstep(-0.10, 0.25, uv.x) *
        smoothstep(0.15, -0.35, uv.x) *
        smoothstep(-0.05, 0.35, uv.y) *
        smoothstep(0.65, 0.10, uv.y);

    return particle * region * rnd;
}

float fuji(vec2 uv) {
    vec2 p = uv - vec2(0.38, 0.16);

    float mountain =
        max(abs(p.x) * 1.9 + p.y * 1.5 - 0.22, -p.y - 0.02);

    float snow =
        max(abs(p.x) * 2.4 + p.y * 2.1 - 0.07, -p.y + 0.05);

    float body = 1.0 - smoothstep(0.0, 0.01, mountain);
    float cap = 1.0 - smoothstep(0.0, 0.01, snow);

    return body * 0.9 + cap * 0.5;
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 suv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 paper = vec3(0.88, 0.86, 0.76);
    vec3 mist = vec3(0.79, 0.77, 0.68);
    vec3 darkInk = vec3(0.16, 0.19, 0.32);
    vec3 midBlue = vec3(0.32, 0.50, 0.58);
    vec3 paleBlue = vec3(0.67, 0.82, 0.80);
    vec3 foam = vec3(0.96, 0.95, 0.88);
    vec3 sand = vec3(0.68, 0.60, 0.42);

    vec3 col = paper;

    float horizon = smoothstep(0.65, 0.28, uv.y);
    col = mix(col, mist, horizon * 0.55);

    float haze = fbm(uv * vec2(4.0, 7.0) + vec2(iTime * 0.02, 0.0));
    col = mix(col, mist * 0.97, haze * 0.12);

    // Fuji in the background
    float fujiVal = fuji(uv);
    col = mix(col, vec3(0.45, 0.43, 0.30), fujiVal);
    col = mix(col, foam, smoothstep(0.95, 1.35, fujiVal));

    // Distant water bands
    float backWave1 = waveBand(uv, 0.60, 0.012, 10.0, 0.7, 1.0);
    float backWave2 = waveBand(uv, 0.69, 0.018, 8.0, 0.5, 2.4);

    float backMask1 = 1.0 - smoothstep(0.0, 0.01, backWave1);
    float backMask2 = 1.0 - smoothstep(0.0, 0.01, backWave2);

    col = mix(col, midBlue, backMask2 * 0.45);
    col = mix(col, darkInk, backMask1 * 0.35);

    // Mid wave
    float midWave = waveBand(uv, 0.77, 0.035, 12.0, 1.0, 0.2);
    float midMask = 1.0 - smoothstep(0.0, 0.02, midWave);
    col = mix(col, paleBlue, midMask);
    col = mix(col, darkInk, crestFoam(uv, 0.77, 0.035, 12.0, 1.0, 0.2) * 0.35);

    // Foreground rolling wave
    float frontWave = waveBand(uv, 0.88, 0.06, 13.0, 1.3, 1.5);
    float frontMask = 1.0 - smoothstep(0.0, 0.025, frontWave);
    col = mix(col, midBlue, frontMask);

    float frontFoam = crestFoam(uv, 0.88, 0.06, 13.0, 1.3, 1.5);
    col = mix(col, foam, frontFoam * 0.9);
    col = mix(col, darkInk, frontFoam * 0.2);

    // Big iconic curl
    float curl = bigCurl(uv);
    col = mix(col, darkInk, curl * 0.95);

    // Inner water body of the curl
    float curlBody =
        1.0 - smoothstep(0.0, 0.035,
            abs(length((uv - vec2(0.22, 0.33)) / vec2(1.0, 0.9)) - 0.22)
        );
    col = mix(col, midBlue, curlBody * 0.6);

    // Foam claws near the crest
    float claws = 0.0;
    claws += clawFoam(uv, vec2(0.30, 0.33), 0.11, 0.4);
    claws += clawFoam(uv, vec2(0.36, 0.30), 0.08, 1.1);
    claws += clawFoam(uv, vec2(0.42, 0.28), 0.06, 2.7);
    claws += clawFoam(uv, vec2(0.47, 0.31), 0.05, 4.3);
    col = mix(col, foam, clamp(claws, 0.0, 1.0));

    // Spray dots
    float sprayVal = spray(uv);
    col += sprayVal * foam * 0.8;

    // Dark contour accents
    float ink1 = 1.0 - smoothstep(0.0, 0.008, abs(midWave));
    float ink2 = 1.0 - smoothstep(0.0, 0.010, abs(frontWave));
    col = mix(col, darkInk, ink1 * 0.35);
    col = mix(col, darkInk, ink2 * 0.45);

    // Warm undertones in troughs
    float trough = smoothstep(0.72, 1.0, uv.y) * (1.0 - frontFoam);
    col = mix(col, sand, trough * 0.16);

    // Subtle paper grain
    float grain = hash21(fragCoord.xy * 0.5) * 0.04;
    col -= grain;

    return vec4(col, 1.0);
}
`;

export { KanagawaWaveShader };
