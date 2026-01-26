/**
 * Advanced Scene Planning & Production System
 * 
 * Central export point for all sophisticated video production services.
 */

export { AdvancedScenePlanner, advancedScenePlanner } from './AdvancedScenePlanner';
export type {
  SceneCompositionAnalysis,
  CameraPerspective,
  NarrativeArc,
  PacingProfile,
  TransitionChoreography
} from './AdvancedScenePlanner';

export { ProductionQualityStandards, productionQualityStandards } from './ProductionQualityStandards';
export type {
  QualityReport,
  QualityIssue,
  QualityImprovement,
  VisualHierarchy,
  ColorHarmony,
  TypographyAnalysis
} from './ProductionQualityStandards';

export { MotionDesignLibrary, motionDesignLibrary } from './MotionDesignLibrary';
export type {
  MotionStyle,
  MotionPreset,
  KeyframeAnimation,
  Keyframe,
  CoordinatedAnimation,
  EasingCurve
} from './MotionDesignLibrary';

export {
  SophisticatedVideoProductionOrchestrator,
  sophisticatedVideoProduction
} from './SophisticatedVideoProductionOrchestrator';
export type {
  ProductionOptions,
  ProductionReport
} from './SophisticatedVideoProductionOrchestrator';

// Advanced cinematography systems (based on dense frame analysis)
export {
  AdvancedCameraPath,
  createOrbitalPath,
  createForwardTrackingPath,
  createDollyZoomPath,
  applyCameraShake
} from './AdvancedCameraSystem';
export type {
  CameraPosition,
  CameraRotation,
  CameraState,
  CameraKeyframe,
  CameraPathOptions
} from './AdvancedCameraSystem';

export {
  CurvedPathAnimation,
  MultiPathOrchestrator,
  cubicBezierPoint,
  cubicBezierTangent,
  getRotationFromTangent,
  createArcPath,
  createSCurvePath,
  createCircularPath,
  createWavePath
} from './CurvedPathAnimation';
export type {
  Point2D,
  Point3D,
  BezierCurve,
  PathAnimationOptions,
  PathPoint
} from './CurvedPathAnimation';

export {
  ParallaxDepthSystem,
  sortByDepth,
  createParallaxAnimation,
  applyCameraDrift,
  createSpaceParallaxScene,
  createLandscapeParallaxScene
} from './ParallaxDepthSystem';
export type {
  ParallaxLayer,
  ParallaxConfig,
  ParallaxTransform
} from './ParallaxDepthSystem';

export {
  AdvancedColorGrading,
  kelvinToRGB,
  createReferenceVideoColorGrading,
  createSimpleTemperatureGrading,
  MOOD_PRESETS
} from './AdvancedColorGrading';
export type {
  ColorGrade,
  ColorGradeKeyframe,
  MoodPreset
} from './AdvancedColorGrading';
