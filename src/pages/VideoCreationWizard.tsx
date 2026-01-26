/**
 * Professional Video Creation Wizard
 * Clean, modern UI for creating videos from templates
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Sparkles, Video as VideoIcon, Image as ImageIcon, Type } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { VIDEO_TEMPLATES } from '@/features/templates/video-templates';
import type { VideoTemplate } from '@/services/video-generation/VideoGenerationService';

const categoryIcons: Record<string, any> = {
  'product-demo': VideoIcon,
  'youtube': Play,
  'social-media': ImageIcon,
  'presentation': Type,
  'motion-graphics': Sparkles,
};

const categoryColors: Record<string, string> = {
  'product-demo': 'from-blue-500 to-cyan-500',
  'youtube': 'from-red-500 to-pink-500',
  'social-media': 'from-purple-500 to-pink-500',
  'presentation': 'from-green-500 to-emerald-500',
  'motion-graphics': 'from-orange-500 to-amber-500',
};

export default function VideoCreationWizard() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'select' | 'customize' | 'preview'>('select');

  const handleTemplateSelect = (template: VideoTemplate) => {
    setSelectedTemplate(template);
    // Initialize variables with defaults
    const initialVars: Record<string, string> = {};
    template.variables?.forEach((v) => {
      initialVars[v.key] = v.default || '';
    });
    setVariables(initialVars);
    setStep('customize');
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    console.log('Generating video with:', {
      template: selectedTemplate?.id,
      variables,
    });
    // Here we would call the video generation service
    setStep('preview');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 px-4 pb-12">
        <div className="container mx-auto max-w-7xl">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => {
              if (step !== 'select') {
                setStep(step === 'preview' ? 'customize' : 'select');
              } else {
                navigate('/');
              }
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Create Professional Videos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a template, customize it, and generate high-quality videos in seconds
            </p>
          </motion.div>

          {/* Step 1: Template Selection */}
          {step === 'select' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {VIDEO_TEMPLATES.map((template) => {
                const Icon = categoryIcons[template.category] || VideoIcon;
                const gradient = categoryColors[template.category] || 'from-gray-500 to-gray-700';

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-primary/50 h-full"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader>
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">{template.name}</CardTitle>
                        <CardDescription className="text-base">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{template.config.aspectRatio}</span>
                          <span>{template.config.duration}s</span>
                          <span>{template.config.fps} FPS</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Step 2: Customization */}
          {step === 'customize' && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">Customize Your Video</CardTitle>
                  <CardDescription className="text-lg">
                    Fill in the details for your {selectedTemplate.name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedTemplate.variables?.map((variable) => (
                    <div key={variable.key} className="space-y-2">
                      <Label htmlFor={variable.key} className="text-base font-semibold">
                        {variable.label}
                        {variable.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Input
                        id={variable.key}
                        type="text"
                        value={variables[variable.key] || ''}
                        onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                        placeholder={`Enter ${variable.label.toLowerCase()}`}
                        className="text-base"
                        required={variable.required}
                      />
                    </div>
                  ))}

                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleGenerate}
                    disabled={selectedTemplate.variables?.some(
                      (v) => v.required && !variables[v.key]
                    )}
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Video
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl">Your Video is Ready!</CardTitle>
                  <CardDescription className="text-lg">
                    Preview your generated video below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <Play className="w-24 h-24 text-white/50 mx-auto mb-4" />
                      <p className="text-white/70 text-lg">Video preview will appear here</p>
                      <p className="text-white/50 text-sm mt-2">
                        {selectedTemplate.config.width}x{selectedTemplate.config.height} • {selectedTemplate.config.fps} FPS
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setStep('customize')}>
                      Edit
                    </Button>
                    <Button className="flex-1 gap-2">
                      <VideoIcon className="w-5 h-5" />
                      Render Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
