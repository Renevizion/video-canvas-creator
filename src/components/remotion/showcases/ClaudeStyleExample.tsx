/**
 * Example: Claude-Style Video Composition
 * 
 * This demonstrates how the system should generate videos with the same
 * quality as manually hand-crafted Remotion code like Claude's MobaJump example.
 * 
 * Story Pattern: Problem → Discovery → Solution → Benefits → CTA
 */

import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// ============================================================================
// SCENE 1: FRUSTRATION (Problem)
// ============================================================================
const FrustrationScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 20 }
  });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e', opacity }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '40px'
      }}>
        {/* Emoji with spring animation */}
        <div style={{
          fontSize: '120px',
          marginBottom: '30px',
          transform: `scale(${scale})`
        }}>😤</div>
        
        {/* Headline */}
        <h1 style={{
          color: '#fff',
          fontSize: '56px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Tired of Manual Video Coding?
        </h1>
        
        {/* Body text */}
        <p style={{
          color: '#ff6b6b',
          fontSize: '36px',
          textAlign: 'center',
          maxWidth: '800px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.4'
        }}>
          "Spending hours writing React components for every single video..."
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 2: STRUGGLES (Build-up)
// ============================================================================
const StrugglesScene = () => {
  const frame = useCurrentFrame();
  
  const problems = [
    { icon: '💻', text: 'Writing 300+ lines per video', delay: 0 },
    { icon: '⏰', text: 'Hours of development time', delay: 20 },
    { icon: '🐛', text: 'Testing and debugging', delay: 40 },
    { icon: '📝', text: 'Hardcoding every detail', delay: 60 }
  ];
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#2d3436' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '40px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '60px',
          fontFamily: 'Arial, sans-serif'
        }}>
          The Manual Video Problem
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {problems.map((problem, index) => {
            const opacity = interpolate(
              frame,
              [problem.delay, problem.delay + 15],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );
            
            const translateX = interpolate(
              frame,
              [problem.delay, problem.delay + 20],
              [-100, 0],
              { extrapolateRight: 'clamp' }
            );
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  opacity,
                  transform: `translateX(${translateX}px)`
                }}
              >
                <span style={{ fontSize: '48px' }}>{problem.icon}</span>
                <span style={{
                  color: '#dfe6e9',
                  fontSize: '36px',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  {problem.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 3: DISCOVERY (Aha moment)
// ============================================================================
const DiscoveryScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const bulbScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.5 }
  });
  
  const textOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f4c75 0%, #1b262c 100%)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '40px'
      }}>
        <div style={{
          fontSize: '140px',
          marginBottom: '40px',
          transform: `scale(${bulbScale})`,
          filter: 'drop-shadow(0 0 30px #ffd700)'
        }}>
          💡
        </div>
        
        <h2 style={{
          color: '#fff',
          fontSize: '64px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          opacity: textOpacity
        }}>
          What If AI Could Do This?
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 4: SOLUTION (Product intro)
// ============================================================================
const SolutionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 15 }
  });
  
  const textOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#6c5ce7' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '40px'
      }}>
        <div style={{
          fontSize: '100px',
          marginBottom: '40px',
          transform: `scale(${logoScale})`
        }}>
          🎬
        </div>
        
        <h1 style={{
          color: '#fff',
          fontSize: '80px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          Video Canvas Creator
        </h1>
        
        <p style={{
          color: '#fff',
          fontSize: '40px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          opacity: textOpacity,
          maxWidth: '900px'
        }}>
          AI-Powered Video Generation with Remotion Quality
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 5: BENEFITS (Key features)
// ============================================================================
const BenefitsScene = () => {
  const frame = useCurrentFrame();
  
  const benefits = [
    { icon: '⚡', title: 'Generate in Seconds', subtitle: 'Not hours', delay: 0 },
    { icon: '🎨', title: 'Professional Quality', subtitle: 'Spring animations, gradients, effects', delay: 25 },
    { icon: '♾️', title: 'Infinite Variations', subtitle: 'One prompt, unlimited videos', delay: 50 }
  ];
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#fd79a8' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '40px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '56px',
          fontWeight: 'bold',
          marginBottom: '60px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Why Video Canvas Creator?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '60px',
          maxWidth: '1200px'
        }}>
          {benefits.map((benefit, index) => {
            const opacity = interpolate(
              frame,
              [benefit.delay, benefit.delay + 20],
              [0, 1],
              { extrapolateRight: 'clamp' }
            );
            
            const translateY = interpolate(
              frame,
              [benefit.delay, benefit.delay + 20],
              [50, 0],
              { extrapolateRight: 'clamp' }
            );
            
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  opacity,
                  transform: `translateY(${translateY}px)`
                }}
              >
                <div style={{
                  fontSize: '80px',
                  marginBottom: '20px',
                  background: '#fff',
                  borderRadius: '50%',
                  width: '140px',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {benefit.icon}
                </div>
                <h3 style={{
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial, sans-serif',
                  marginBottom: '10px'
                }}>
                  {benefit.title}
                </h3>
                <p style={{
                  color: '#fff',
                  fontSize: '20px',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  {benefit.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// SCENE 6: CTA (Call to action)
// ============================================================================
const CTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20 }
  });
  
  const buttonScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15 }
  });
  
  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '40px'
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '72px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          marginBottom: '20px',
          transform: `scale(${scale})`
        }}>
          Ready to Try It?
        </h1>
        
        <p style={{
          color: '#fff',
          fontSize: '36px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          marginBottom: '60px',
          maxWidth: '900px'
        }}>
          Type a prompt and watch AI create professional videos instantly
        </p>
        
        <div style={{
          background: '#fff',
          color: '#764ba2',
          fontSize: '40px',
          fontWeight: 'bold',
          padding: '25px 60px',
          borderRadius: '50px',
          fontFamily: 'Arial, sans-serif',
          transform: `scale(${buttonScale})`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          Start Creating Videos
        </div>
        
        <p style={{
          color: '#fff',
          fontSize: '28px',
          fontFamily: 'Arial, sans-serif',
          marginTop: '40px',
          opacity: 0.9
        }}>
          🎬 Same quality as manual code, zero coding required
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const ClaudeStyleExample = () => {
  return (
    <AbsoluteFill>
      {/* Each scene: 90 frames = 3 seconds at 30fps */}
      <Sequence from={0} durationInFrames={90}>
        <FrustrationScene />
      </Sequence>
      
      <Sequence from={90} durationInFrames={90}>
        <StrugglesScene />
      </Sequence>
      
      <Sequence from={180} durationInFrames={60}>
        <DiscoveryScene />
      </Sequence>
      
      <Sequence from={240} durationInFrames={75}>
        <SolutionScene />
      </Sequence>
      
      <Sequence from={315} durationInFrames={90}>
        <BenefitsScene />
      </Sequence>
      
      <Sequence from={405} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
