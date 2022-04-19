uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uTime;
uniform float uBigWaverSpeed;

varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWaverSpeed)*
                      sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWaverSpeed) * 
                      uBigWavesElevation;
    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varyings
    vElevation = elevation;
}