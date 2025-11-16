import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="text-white py-16" style={{background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)'}}>
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/">
            <Button variant="secondary" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-4">About Balkly</h1>
          <p className="text-xl opacity-90">Ujedinjeni Balkanci u Emiratima</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Balkly connects the Balkan community across the United Arab Emirates. 
            We provide a trusted platform where Balkans people can buy, sell, find jobs, 
            attend events, and build lasting connections - all in one place.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-balkly-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-balkly-blue" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-gray-100">Community First</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built by Balkans, for Balkans. We understand your needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-teal-glow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-teal-glow" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-gray-100">Safe & Secure</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Protected payments, verified sellers, and secure messaging.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-iris-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-iris-purple" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-gray-100">UAE Wide</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Serving Dubai, Abu Dhabi, Sharjah, and all Emirates.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Our Story</h2>
          <div className="prose max-w-none text-gray-700 dark:text-gray-300">
            <p className="text-lg mb-4">
              Balkly was created to unite the Balkan community in the UAE. Whether you're from 
              Serbia, Croatia, Bosnia, or any Balkan country, Balkly is your home away from home.
            </p>
            <p className="text-lg mb-4">
              We started with a simple idea: make it easier for Balkans people in UAE to connect, 
              trade, and support each other. Today, we're proud to serve thousands of community 
              members across all Emirates.
            </p>
            <p className="text-lg">
              From finding a job to buying a car, from renting an apartment to attending community 
              events - Balkly brings it all together in one trusted platform.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <Card className="text-white" style={{background: 'linear-gradient(90deg, #1E63FF, #7C3AED)'}}>
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-8 opacity-90">
              Be part of the largest Balkan community platform in UAE
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold" asChild>
                <Link href="/auth/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/50 hover:bg-white/20 font-bold" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

