const SmokeShader = `
uniform float2 iResolution;
uniform float iTime;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
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

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;

    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.0 + vec2(7.3, 11.7);
        a *= 0.5;
    }

    return v;
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.18;

    // vertical drifting smoke
    vec2 q = p;
    q.y += t * 0.9;
    q.x += sin(q.y * 2.5 - t * 1.2) * 0.08;

    vec2 warp = vec2(
        fbm(q * 1.2 + vec2(0.0, t)),
        fbm(q * 1.2 + vec2(5.2, -t))
    );

    vec2 s = q + (warp - 0.5) * 0.7;

    float base = fbm(s * 2.2);
    float detail = fbm(s * 4.8 + vec2(2.3, 1.7));
    float wisps = fbm(s * 8.0 - vec2(1.4, 3.8));

    float smoke = base * 0.62 + detail * 0.28 + wisps * 0.10;
    smoke = smoothstep(0.28, 0.82, smoke);

    // plume shape
    float plume = exp(-p.x * p.x * 1.8);
    plume *= 1.1 - smoothstep(-1.2, 1.3, p.y);

    float density = smoke * plume;

    // soft billowy breakup
    density += smoothstep(0.55, 0.9, wisps) * plume * 0.18;

    // black pockets / soot
    float soot = fbm(s * 5.5 + vec2(-t * 0.4, t * 0.2));
    soot = smoothstep(0.52, 0.86, soot) * density;

    // grey-white smoke palette
    vec3 darkSmoke = vec3(0.05, 0.05, 0.05);
    vec3 midSmoke = vec3(0.38, 0.38, 0.40);
    vec3 lightSmoke = vec3(0.88, 0.88, 0.90);

    vec3 col = mix(darkSmoke, midSmoke, smoothstep(0.15, 0.65, density));
    col = mix(col, lightSmoke, smoothstep(0.45, 0.95, density));
    col = mix(col, vec3(0.0), soot * 0.55);

    // subtle inner brightness
    col += vec3(1.0) * density * 0.05;

    float alpha = smoothstep(0.02, 0.72, density);

    return vec4(col, alpha);
}
`;

export { SmokeShader };
