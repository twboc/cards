const InkCloudShader = `
uniform float2 iResolution;
uniform float iTime;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}

mat2 rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
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

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;

    for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p = rot(0.35) * p * 2.02 + vec2(13.7, 9.2);
        a *= 0.5;
    }

    return v;
}

vec3 palette(float t) {
    vec3 c1 = vec3(0.00, 0.85, 0.95); // cyan
    vec3 c2 = vec3(1.00, 0.72, 0.05); // yellow/orange
    vec3 c3 = vec3(1.00, 0.05, 0.55); // magenta
    vec3 c4 = vec3(0.62, 0.18, 0.88); // violet

    if (t < 0.33) {
        return mix(c1, c2, smoothstep(0.0, 0.33, t));
    } else if (t < 0.66) {
        return mix(c2, c3, smoothstep(0.33, 0.66, t));
    } else {
        return mix(c3, c4, smoothstep(0.66, 1.0, t));
    }
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.16;

    // Stretch cloud horizontally like the reference image
    vec2 q = p;
    q.x *= 0.82;
    q.y *= 1.18;

    // Flow field
    vec2 flow = vec2(
        fbm(q * 1.6 + vec2(t * 0.8, -t * 0.25)),
        fbm(q * 1.6 + vec2(8.1 - t * 0.35, 3.7 + t * 0.45))
    );

    vec2 warped = q;
    warped += (flow - 0.5) * 0.65;
    warped += 0.18 * vec2(
        fbm(q * 3.2 + vec2(1.2, 5.4) + t),
        fbm(q * 3.2 + vec2(7.8, 2.1) - t)
    );

    // Long cloud backbone
    float ribbon = exp(-pow(q.y * 2.2, 2.0));
    ribbon *= 0.75 + 0.25 * sin(q.x * 2.5 - t * 5.0);

    // Volumetric blobs / puffs
    float d1 = fbm(warped * 2.2 + vec2(-2.0, 0.4));
    float d2 = fbm(warped * 3.8 - vec2(1.2, 0.8));
    float d3 = fbm(warped * 6.2 + vec2(4.7, -1.9));

    float smoke = d1 * 0.55 + d2 * 0.30 + d3 * 0.15;
    smoke = smoothstep(0.36, 0.86, smoke);

    // Edge breakup / wisps
    float wisps = fbm(warped * 9.0 + vec2(t * 0.5, -t * 0.2));
    wisps = smoothstep(0.48, 0.85, wisps);

    float density = smoke * ribbon;
    density += wisps * ribbon * 0.35;

    // Extra puffy lobes across the cloud
    float lobe1 = exp(-length((q - vec2(-0.72, 0.00)) * vec2(1.4, 2.0)));
    float lobe2 = exp(-length((q - vec2(-0.08, 0.03)) * vec2(1.5, 2.1)));
    float lobe3 = exp(-length((q - vec2( 0.52, 0.02)) * vec2(1.7, 2.2)));

    density *= 0.70 + 0.65 * (lobe1 + lobe2 + lobe3);

    // Softer transparent edges
    float edgeFade = 1.0 - smoothstep(0.72, 1.55, length(q * vec2(0.85, 1.2)));
    density *= edgeFade;

    // Color progression from left to right, like the image
    float colorBand = smoothstep(-1.2, 1.2, q.x);
    colorBand += 0.14 * (flow.x - 0.5);
    colorBand += 0.08 * sin(q.y * 6.0 + fbm(q * 4.0) * 6.2831);
    colorBand = clamp(colorBand, 0.0, 1.0);

    vec3 col = palette(colorBand);

    // Bright internal bloom / ink luminosity
    float innerGlow = smoothstep(0.22, 0.95, density);
    vec3 bright = mix(col, vec3(1.0), innerGlow * 0.16);

    // Layered opacity for cloud feel
    float alpha = smoothstep(0.06, 0.72, density);
    alpha *= 0.95;

    // Slight milky softness like ink in water
    vec3 finalColor = bright;
    finalColor += vec3(1.0) * density * 0.06;

    return vec4(finalColor, alpha);
}
`;

export { InkCloudShader };
