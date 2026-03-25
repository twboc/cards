export const ColdStrandsShader = `
uniform float2 iResolution;
uniform float iTime;

float ncos(float x) {
    float c = cos(x);
    return c / (0.5 + 0.4 * abs(c));
}

vec3 tanhApprox3(vec3 x) {
    vec3 e2x = exp(2.0 * x);
    return (e2x - 1.0) / (e2x + 1.0);
}

half4 main(vec2 fragCoord) {
    vec2 s = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
    s.y = -s.y;

    float v = (s.y + 1.0) * (s.y + 1.0) * 0.25;
    s.y -= 1.2;

    float ay = max(abs(s.y), 0.001);
    float per = 2.0 / ay;

    vec3 col = vec3(0.0);

    for (int i = 0; i < 13; i++) {
        float z = float(i) * 0.08;

        float d = 1.0 + 0.4 * z;
        vec2 p = vec2(s.x * d, s.y + d) * per;

        vec2 q = p;
        q.y += 2.8 * iTime;

        vec2 c = q - 0.05 * iTime + sin(q * 5.3 + 0.03 * iTime);

        float shift = cos(z / 0.08);
        float wave = ncos(q.y * 1.4) + ncos(q.y * 0.9 + 0.3 * iTime);
        q.x += shift + wave / (1.0 + 0.01 * per * per);

        float w = q.x;
        float l = sin(q.y * 0.7 + z / 0.08 + 3.4 * iTime * sign(shift));
        float intensity = exp(min(l, -l / 0.3 / (1.0 + 4.0 * w * w)));

        vec3 coldA = vec3(0.05, 0.12, 0.45);
        vec3 coldB = vec3(0.55, 0.85, 1.0);

        float mixT = tanhApprox3(vec3(shift / 0.1)).x * 0.5 + 0.5;
        vec3 tint = mix(coldA, coldB, mixT);

        tint += vec3(0.15, 0.0, 0.25) *
            smoothstep(0.3, 0.7, sin(z * 30.0 + iTime * 0.7));

        col += intensity * tint / (abs(w) + 0.01 * per) * per;
    }

    col = tanhApprox3(col / 20.0);
    col = col * col;

    return half4(clamp(col, 0.0, 1.0), 1.0);
}
`;
