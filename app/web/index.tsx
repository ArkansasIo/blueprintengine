import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Web Landing Page
 * Professional landing page for UE5 Blueprint Editor
 */
export default function WebLandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <View style={styles.navContent}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="cube" size={28} color="#06b6d4" />
            <Text style={styles.logoText}>Blueprint Editor</Text>
          </View>
          <View style={styles.navLinks}>
            <Pressable style={styles.navLink}>
              <Text style={styles.navLinkText}>Features</Text>
            </Pressable>
            <Pressable style={styles.navLink}>
              <Text style={styles.navLinkText}>Documentation</Text>
            </Pressable>
            <Pressable style={styles.navLink}>
              <Text style={styles.navLinkText}>Community</Text>
            </Pressable>
            <Pressable style={styles.navLink}>
              <Text style={styles.navLinkText}>Support</Text>
            </Pressable>
          </View>
          <Pressable style={styles.launchButton}>
            <Text style={styles.launchButtonText}>Launch Editor</Text>
          </Pressable>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Visual Programming Made Simple
          </Text>
          <Text style={styles.heroSubtitle}>
            Create complex logic with an intuitive node-based visual editor.
            No coding required.
          </Text>
          <View style={styles.heroCTA}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Start Creating</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Watch Demo</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.heroImage}>
          <View style={styles.editorPreview}>
            <MaterialCommunityIcons name="cube" size={80} color="#06b6d4" />
            <Text style={styles.editorPreviewText}>Blueprint Editor</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Powerful Features</Text>
        <Text style={styles.sectionSubtitle}>
          Everything you need to create professional visual logic
        </Text>

        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <Pressable
              key={feature.id}
              style={[
                styles.featureCard,
                hoveredFeature === feature.id && styles.featureCardHovered,
              ]}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <View
                style={[styles.featureIcon, { backgroundColor: feature.color }]}
              >
                <MaterialCommunityIcons
                  name={feature.icon as any}
                  size={32}
                  color="#fff"
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Node Types Section */}
      <View style={styles.nodeTypesSection}>
        <Text style={styles.sectionTitle}>39 Node Types</Text>
        <Text style={styles.sectionSubtitle}>
          Comprehensive library of pre-built nodes for any task
        </Text>

        <View style={styles.nodeGrid}>
          {nodeCategories.map((category) => (
            <View key={category.id} style={styles.nodeCategory}>
              <View
                style={[
                  styles.nodeCategoryIcon,
                  { backgroundColor: category.color },
                ]}
              >
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={24}
                  color="#fff"
                />
              </View>
              <Text style={styles.nodeCategoryTitle}>{category.name}</Text>
              <Text style={styles.nodeCategoryCount}>
                {category.count} nodes
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>39</Text>
          <Text style={styles.statLabel}>Node Types</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>60+</Text>
          <Text style={styles.statLabel}>UI Components</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>35+</Text>
          <Text style={styles.statLabel}>Keyboard Shortcuts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>TypeScript</Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Build?</Text>
        <Text style={styles.ctaSubtitle}>
          Start creating visual blueprints today. No installation required.
        </Text>
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Launch Editor Now</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Product</Text>
            <Pressable>
              <Text style={styles.footerLink}>Features</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Pricing</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Documentation</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Changelog</Text>
            </Pressable>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Community</Text>
            <Pressable>
              <Text style={styles.footerLink}>Forum</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Discord</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>GitHub</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Twitter</Text>
            </Pressable>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Company</Text>
            <Pressable>
              <Text style={styles.footerLink}>About</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Blog</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Contact</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.footerLink}>Privacy</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerBottom}>
          <Text style={styles.footerCopyright}>
            © 2026 Blueprint Editor. All rights reserved.
          </Text>
          <View style={styles.socialLinks}>
            <Pressable>
              <MaterialCommunityIcons name="github" size={20} color="#64748b" />
            </Pressable>
            <Pressable style={{ marginLeft: 16 }}>
              <MaterialCommunityIcons name="twitter" size={20} color="#64748b" />
            </Pressable>
            <Pressable style={{ marginLeft: 16 }}>
              <MaterialCommunityIcons name="discord" size={20} color="#64748b" />
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * Features Data
 */
const features = [
  {
    id: 'nodes',
    icon: 'cube',
    title: 'Visual Nodes',
    description: '39 different node types for complete logic creation',
    color: '#3b82f6',
  },
  {
    id: 'debugging',
    icon: 'bug',
    title: 'Real-time Debugging',
    description: 'Breakpoints, variable inspection, and execution tracing',
    color: '#ec4899',
  },
  {
    id: 'compilation',
    icon: 'wrench',
    title: 'Compilation',
    description: 'Compile to bytecode, code generation, and validation',
    color: '#f59e0b',
  },
  {
    id: 'version',
    icon: 'git-branch',
    title: 'Version Control',
    description: 'Save snapshots and restore previous versions',
    color: '#10b981',
  },
  {
    id: 'templates',
    icon: 'layout-template',
    title: 'Templates',
    description: 'Pre-built templates for common patterns',
    color: '#06b6d4',
  },
  {
    id: 'ai',
    icon: 'robot',
    title: 'AI Assistant',
    description: 'Smart suggestions and blueprint generation',
    color: '#8b5cf6',
  },
];

/**
 * Node Categories Data
 */
const nodeCategories = [
  { id: 'control', name: 'Control Flow', count: 5, icon: 'call-split', color: '#3b82f6' },
  { id: 'data', name: 'Data', count: 4, icon: 'database', color: '#06b6d4' },
  { id: 'events', name: 'Events', count: 4, icon: 'bell', color: '#f59e0b' },
  { id: 'functions', name: 'Functions', count: 3, icon: 'function', color: '#8b5cf6' },
  { id: 'math', name: 'Math', count: 5, icon: 'plus', color: '#10b981' },
  { id: 'logic', name: 'Logic', count: 7, icon: 'plus-circle', color: '#ec4899' },
  { id: 'string', name: 'String', count: 4, icon: 'format-text', color: '#14b8a6' },
  { id: 'array', name: 'Array', count: 5, icon: 'format-list-numbered', color: '#a855f7' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  navbar: {
    height: 80,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    justifyContent: 'center',
  },
  navContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
    flex: 1,
    marginLeft: 48,
  },
  navLink: {
    paddingVertical: 8,
  },
  navLinkText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  launchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#06b6d4',
    borderRadius: 6,
  },
  launchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  heroSection: {
    paddingVertical: 120,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  heroContent: {
    flex: 1,
    marginRight: 60,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 16,
    lineHeight: 56,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#cbd5e1',
    marginBottom: 32,
    lineHeight: 28,
  },
  heroCTA: {
    flexDirection: 'row',
    gap: 16,
  },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#06b6d4',
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#06b6d4',
  },
  heroImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editorPreview: {
    width: 300,
    height: 300,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  editorPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 12,
  },
  featuresSection: {
    paddingVertical: 100,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 60,
  },
  featuresGrid: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  featureCard: {
    width: '30%',
    minWidth: 280,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 28,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  featureCardHovered: {
    borderColor: '#06b6d4',
    backgroundColor: '#1a2f3f',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
  },
  nodeTypesSection: {
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  nodeGrid: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  nodeCategory: {
    width: '22%',
    minWidth: 160,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  nodeCategoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  nodeCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  nodeCategoryCount: {
    fontSize: 12,
    color: '#64748b',
  },
  statsSection: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-around',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#06b6d4',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  ctaSection: {
    paddingVertical: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 32,
  },
  ctaButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  footerContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  footerSection: {
    width: '22%',
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 12,
    color: '#cbd5e1',
    marginBottom: 10,
  },
  footerBottom: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTopWidth: 1,
    paddingTopColor: '#334155',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 20,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#64748b',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
});
