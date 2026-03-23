const InkCloudSmoothShader = `
uniform float2 iResolution;
uniform float iTime;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm3(vec2 p) {
    float v = 0.0;
    v += 0.5000 * noise(p); p = p * 2.0 + vec2(11.3, 7.1);
    v += 0.2500 * noise(p); p = p * 2.0 + vec2(5.7, 13.9);
    v += 0.1250 * noise(p);
    return v;
}

vec3 palette(float t) {
    vec3 c1 = vec3(0.02, 0.86, 0.95);
    vec3 c2 = vec3(1.00, 0.70, 0.05);
    vec3 c3 = vec3(1.00, 0.05, 0.55);
    vec3 c4 = vec3(0.62, 0.18, 0.90);

    if (t < 0.33) {
        return mix(c1, c2, smoothstep(0.0, 0.33, t));
    } else if (t < 0.66) {
        return mix(c2, c3, smoothstep(0.33, 0.66, t));
    } else {
        return mix(c3, c4, smoothstep(0.66, 1.0, t));
    }
}

half4 main(vec2 fragCoord) {
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    float t = iTime * 0.12;

    // Wide horizontal cloud shape
    vec2 q = p;
    q.x *= 0.78;
    q.y *= 1.02;

    // Cheaper flow
    vec2 flow = vec2(
        fbm3(q * 1.25 + vec2(t * 0.65, -t * 0.18)),
        fbm3(q * 1.25 + vec2(6.2 - t * 0.28, 2.8 + t * 0.22))
    );

    vec2 warped = q + (flow - 0.5) * 0.75;

    // Backbone
    float ribbon = exp(-q.y * q.y * 1.8);
    ribbon *= 0.92 + 0.18 * sin(q.x * 1.8 - t * 3.0);

    // Main density
    float d1 = fbm3(warped * 1.8);
    float d2 = noise(warped * 4.5 + vec2(2.0, 1.0));
    float smoke = d1 * 0.72 + d2 * 0.28;
    smoke = smoothstep(0.32, 0.84, smoke);

    float density = smoke * ribbon;

    // Big puffy volume, only 3 lobes
    float lobe1 = exp(-length((q - vec2(-0.90, 0.00)) * vec2(1.15, 1.7)));
    float lobe2 = exp(-length((q - vec2(-0.10, 0.02)) * vec2(1.20, 1.9)));
    float lobe3 = exp(-length((q - vec2( 0.75, 0.00)) * vec2(1.35, 2.0)));
    density *= 0.95 + (lobe1 + lobe2 + lobe3) * 0.75;

    // Softer edge fade so it fills space
    float edgeFade = 1.0 - smoothstep(1.7, 2.5, length(q * vec2(0.82, 1.0)));
    density *= edgeFade;

    // Horizontal color drift
    float band = smoothstep(-1.3, 1.3, q.x);
    band += 0.12 * (flow.x - 0.5);
    band = clamp(band, 0.0, 1.0);

    vec3 col = palette(band);

    // Cheap inner brightening
    float glow = smoothstep(0.18, 0.95, density);
    vec3 finalColor = mix(col, vec3(1.0), glow * 0.14);
    finalColor += density * 0.05;

    float alpha = smoothstep(0.03, 0.62, density);

    return vec4(finalColor, alpha);
}
`;

export { InkCloudSmoothShader };
