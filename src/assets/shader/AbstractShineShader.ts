export const AbstractShineShader = `
uniform float2 iResolution;
uniform float iTime;

vec2 rot2(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(
        c * p.x - s * p.y,
        s * p.x + c * p.y
    );
}

vec3 palette(float i) {
    vec3 a = vec3(0.50, 0.38, 0.26);
    vec3 b = vec3(0.50, 0.35, 0.25);
    vec3 c = vec3(1.00, 1.00, 1.00);
    vec3 d = vec3(0.00, 0.12, 0.25);
    return a + b * cos(6.2831853 * (c * i + d));
}

vec3 palette2(float i) {
    vec3 a = vec3(0.742702, 0.908877, 0.959831);
    vec3 b = vec3(-0.711000, 0.275000, -0.052000);
    vec3 c = vec3(1.000000, 1.855000, 1.000000);
    vec3 d = vec3(0.180000, 0.091000, 0.380000);
    return a + b * cos(6.2831853 * (c * i + d));
}

vec4 tanhApprox4(vec4 x) {
    vec4 e2x = exp(2.0 * x);
    return (e2x - 1.0) / (e2x + 1.0);
}

half4 main(vec2 fragCoord) {
    vec2 u = fragCoord;

    vec2 uv = (u - 0.5 * iResolution.xy + 0.5) / iResolution.y;
    uv.y = -uv.y;

    float t = mod(iTime, 6.283185);

    vec4 fragColor = vec4(0.0);
    float s = 0.0;

    vec3 d = normalize(vec3(
        2.0 * u.x - iResolution.x,
        -(2.0 * u.y - iResolution.y),
        iResolution.y
    ));

    vec3 p = vec3(0.0, 0.0, t);

    for (int k = 0; k < 20; k++) {
        float fi = float(k);

        p.xy = rot2(p.xy, -p.z * 0.01 - t * 0.05);

        s = 0.6;
        s = max(s, 4.0 * (-length(p.xy) + 10.0));
        s += abs(
            p.y * 0.004 +
            sin(t - p.x * 0.5) * 0.9 +
            1.0
        );

        p += d * s;

        fragColor += 1.0 / (s * 0.2);
    }

    float paletteScale = abs(sin(iTime * 0.02) * 50.0) + 6.0;
    vec3 baseCol = palette(length(p) / paletteScale);
    fragColor *= vec4(baseCol, 1.0);

    float shimmer = smoothstep(
        0.001,
        abs(sin(iTime * 5.0)),
        0.7 - length(sin(uv * 200.0) / 1.5) - abs(uv.y) + 0.2
    );

    fragColor -= 20.0 * shimmer;
    fragColor /= 50.0;

    float l = length(uv);

    fragColor *= (1.2 - l);

    vec4 centerGlow = vec4(palette(l - 0.23), 1.0);
    fragColor = mix(fragColor, centerGlow, 1.0 - smoothstep(0.01, 0.95, l));

    fragColor = tanhApprox4(fragColor + fragColor);

    return half4(clamp(fragColor, 0.0, 1.0));
}
`;
