'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import JRGrahamLayout from '@/components/JRGrahamLayout'
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  Heart,
  Star,
  ArrowRight,
  CheckCircle,
  Church,
  Award,
  Clock,
  Shield
} from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: Church,
      title: 'Faith-Based Community',
      description: 'Serving the Northern Neck Baptist Association and local churches with dedication and Christian values.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'Providing a welcoming space for community events, fellowship, and gatherings of all sizes.'
    },
    {
      icon: Award,
      title: 'Quality Facilities',
      description: 'Modern, well-maintained facilities with professional amenities and comfortable environments.'
    },
    {
      icon: Shield,
      title: 'Trusted Service',
      description: 'Years of experience hosting successful events with reliable service and attention to detail.'
    }
  ]

  const values = [
    {
      title: 'Christian Fellowship',
      description: 'Fostering spiritual growth and community connections through shared spaces and experiences.'
    },
    {
      title: 'Community Service',
      description: 'Supporting local organizations, churches, and families with accessible, quality facilities.'
    },
    {
      title: 'Excellence',
      description: 'Maintaining high standards in facility management, customer service, and event support.'
    },
    {
      title: 'Accessibility',
      description: 'Ensuring our facilities are welcoming and accessible to all members of our community.'
    }
  ]

  return (
    <JRGrahamLayout currentPage="about">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About Us
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-4xl mx-auto">
            The Joseph R. Graham Center serves as a cornerstone of community life, 
            providing quality facilities for worship, fellowship, and celebration.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The Joseph R. Graham Center is dedicated to serving the Northern Neck Baptist Association 
                and the broader community by providing exceptional facilities for worship, fellowship, 
                education, and celebration.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Named in honor of Joseph R. Graham, our center continues his legacy of faith, 
                community service, and dedication to bringing people together in Christian fellowship.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Community Centered</h4>
                    <p className="text-gray-600">Serving churches, families, and organizations throughout the Northern Neck region</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Faith-Based Values</h4>
                    <p className="text-gray-600">Grounded in Christian principles and committed to serving others with love and excellence</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Facilities</h4>
                    <p className="text-gray-600">Modern, well-maintained spaces designed to accommodate events of all sizes and types</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Joseph R. Graham Legacy</h3>
              <p className="text-gray-700 mb-6">
                Joseph R. Graham was a pillar of the Northern Neck Baptist community, 
                known for his unwavering faith, generous spirit, and dedication to bringing 
                people together in Christian fellowship.
              </p>
              <p className="text-gray-700 mb-6">
                This center stands as a testament to his vision of a place where the 
                community could gather for worship, celebration, education, and mutual support.
              </p>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Continuing the Vision</h4>
                <p className="text-gray-600 text-sm">
                  Today, we honor his memory by maintaining the highest standards of 
                  hospitality and service for all who enter our doors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence, community service, and Christian values 
              makes us the preferred choice for events throughout the Northern Neck region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-purple-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape how we serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Northern Neck Baptist Association Section */}
      <div className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Northern Neck Baptist Association
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-4xl mx-auto">
            Proudly serving as the fellowship center for the Northern Neck Baptist Association, 
            hosting monthly events, conferences, and gatherings that strengthen our regional church community.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white/10 rounded-lg p-6">
              <Calendar className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Monthly Fellowship</h3>
              <p className="opacity-90">Regular gatherings for NNBA member churches</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <Users className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Regional Unity</h3>
              <p className="opacity-90">Bringing together Baptist churches across the Northern Neck</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <Heart className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Shared Mission</h3>
              <p className="opacity-90">Supporting our collective ministry and outreach efforts</p>
            </div>
          </div>

          <a 
            href="https://www.nnbaptist.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Visit NNBAPTIST.ORG
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </a>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Plan Your Event?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're planning a church event, community gathering, or special celebration, 
            we're here to help make it memorable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" variant="default" className="bg-purple-600 hover:bg-purple-700">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Space
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>3989 White Chapel Road, Lively, VA 22507</span>
            <span className="mx-4">•</span>
            <Phone className="w-5 h-5 mr-2" />
            <a href="tel:804-462-9011" className="text-purple-600 hover:text-purple-700">
              804-462-9011
            </a>
          </div>
        </div>
      </div>
    </JRGrahamLayout>
  )
}
