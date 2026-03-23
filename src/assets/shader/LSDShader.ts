const LSDShader = `
uniform float2 iResolution;
uniform float iTime;

vec3 palette(float t) {
    vec3 a = vec3(0.62, 0.52, 0.58);
    vec3 b = vec3(0.75, 0.72, 0.78);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.02, 0.18, 0.42);

    return a + b * cos(6.28318 * (c * t + d));
}

half4 main(vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.7;

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // sharper kaleidoscope segmentation
    float segments = 8.0;
    float segAngle = 6.28318 / segments;
    a = mod(a, segAngle);
    a = abs(a - segAngle * 0.5);

    // stronger spiral deformation
    float spiral = r * 3.4 - t * 1.5;

    // sharper petal structures
    float petals = sin(a * 16.0 + spiral * 3.6);
    float rings = sin(r * 24.0 - t * 4.8);
    float waves = sin(r * 10.0 + a * 10.0 - t * 2.3);
    float spokes = sin(a * 24.0 - r * 8.0 + t * 1.2);

    float glow =
        abs(petals) * 0.42 +
        abs(rings) * 0.28 +
        abs(waves) * 0.24 +
        abs(spokes) * 0.18;

    // make highlights much sharper
    glow = pow(glow, 3.4);

    // tighten center bloom and preserve edge detail
    float bloom = 1.15 / (1.0 + r * 2.1);
    glow *= bloom;

    // more vibrant palette response
    vec3 col = palette(r * 1.2 + a * 0.9 + t * 0.45);
    col *= 1.35;

    // extra saturation push
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, 1.45);

    vec3 finalColor = col * glow;

    // darker background for stronger contrast
    vec3 bg = vec3(0.006, 0.008, 0.018) + 0.012 / (r + 0.4);

    finalColor += bg;

    // slight contrast curve
    finalColor = pow(finalColor, vec3(0.9));

    return vec4(finalColor, 1.0);
}
`;

export { LSDShader };
