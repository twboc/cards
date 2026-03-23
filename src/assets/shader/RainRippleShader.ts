const RainRipplesShader = `
uniform float2 iResolution;
uniform float iTime;

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 rainCell(vec2 id) {
    float x = hash12(id + 1.37);
    float y = hash12(id + 8.91);
    return vec2(x, y);
}

half4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 p = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    float t = iTime * 0.9;

    vec3 bg = vec3(0.06, 0.09, 0.13);
    bg += 0.02 * vec3(uv.y);

    float rippleField = 0.0;
    float highlightField = 0.0;

    const float GRID = 7.0;

    vec2 gv = uv * GRID;
    vec2 baseId = floor(gv);

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 offset = vec2(float(i), float(j));
            vec2 id = baseId + offset;

            vec2 rnd = rainCell(id);

            // Each cell drops at a different looping time
            float localTime = fract(t * (0.45 + rnd.x * 0.4) + rnd.y);

            // Drop origin inside the cell
            vec2 center = (id + rnd) / GRID;

            float d = distance(uv, center);

            // Expanding radius over time
            float radius = localTime * 0.22;

            // Thin ripple ring
            float ring = smoothstep(0.018, 0.0, abs(d - radius));

            // Fade over time
            float fade = 1.0 - smoothstep(0.0, 1.0, localTime);

            // Small inner disturbance for realism
            float inner = smoothstep(0.03, 0.0, d) * (1.0 - localTime);

            rippleField += ring * fade;
            highlightField += inner * fade * 0.8;
        }
    }

    // Softer broader wave interference
    float waves = 0.5 + 0.5 * sin((p.x + p.y) * 18.0 - t * 2.0);
    waves *= 0.05;

    vec3 waterTint = vec3(0.10, 0.20, 0.28);
    vec3 rippleColor = vec3(0.75, 0.88, 1.0);

    vec3 color = bg + waterTint * 0.35;
    color += rippleColor * rippleField * 0.55;
    color += vec3(0.95, 0.98, 1.0) * highlightField * 0.6;
    color += waves;

    // Subtle vignette
    float vignette = smoothstep(1.4, 0.2, length(p));
    color *= vignette;

    return vec4(color, 1.0);
}
`;

export { RainRipplesShader };
