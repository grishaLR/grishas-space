import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";
import { AudioData } from "@hooks/useAudioAnalyzer";

interface AudioVisualizer3DProps {
  audioData: AudioData;
  isPlaying: boolean;
}

export const AudioVisualizer3D: React.FC<AudioVisualizer3DProps> = ({
  audioData,
  isPlaying,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<Mesh[]>([]);
  const centerSphereRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Rotate the entire visualization
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;

    // Animate center sphere based on bass
    if (centerSphereRef.current && audioData) {
      const scale = 1 + (audioData.bass || 0) * 2;
      centerSphereRef.current.scale.set(scale, scale, scale);
      centerSphereRef.current.rotation.x += 0.01;
      centerSphereRef.current.rotation.y += 0.01;
    }

    // Animate frequency bars
    barsRef.current.forEach((bar, i) => {
      if (!bar || !audioData?.frequency) return;

      // Use more frequency data points for better resolution
      const frequencyIndex = Math.floor((i / 32) * audioData.frequency.length);
      const value = (audioData.frequency[frequencyIndex] || 0) / 255;

      // Increase sensitivity and add minimum scale
      const scale = Math.max(0.3, 0.1 + value * 8); // Further increased sensitivity
      bar.scale.y = scale;
      bar.position.y = scale / 2;

      // Color based on frequency
      const material = bar.material as MeshStandardMaterial;
      if (i < 8) {
        // Bass - purple
        material.emissive.setHex(0x9b59b6);
        material.emissiveIntensity = value;
      } else if (i < 24) {
        // Mid - mix
        material.emissive.setHex(0x7d5ba6);
        material.emissiveIntensity = value * 0.8;
      } else {
        // Treble - green
        material.emissive.setHex(0x2ecc71);
        material.emissiveIntensity = value * 0.6;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Center sphere */}
      <mesh ref={centerSphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#9b59b6"
          emissive="#9b59b6"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Frequency bars in a circle */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * 4;
        const z = Math.sin(angle) * 4;

        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) barsRef.current[i] = el;
            }}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial
              color="#2ecc71"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        );
      })}

      {/* Ambient particles */}
      {isPlaying && (
        <group>
          {Array.from({ length: 50 }).map((_, i) => (
            <mesh
              key={`particle-${i}`}
              position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={audioData?.volume || 0}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
