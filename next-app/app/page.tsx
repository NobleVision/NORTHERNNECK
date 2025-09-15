'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import JRGrahamLayout from '@/components/JRGrahamLayout'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Shield,
  Award
} from 'lucide-react'

export default function HomePage() {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      const response = await fetch('/api/spaces')
      const data = await response.json()
      if (data.success) {
        setSpaces(data.data.slice(0, 4)) // Show first 4 spaces
      }
    } catch (error) {
      console.error('Error fetching spaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const eventTypes = [
    'Weddings & Receptions', 'Corporate Meetings', 'Church Services', 'Community Events',
    'Birthday Parties', 'Anniversary Celebrations', 'Baby Showers', 'Graduation Parties',
    'Workshops & Seminars', 'Training Sessions', 'Conferences', 'Retreats',
    'Fundraising Events', 'Holiday Celebrations', 'Memorial Services', 'Family Reunions',
    'Business Presentations', 'Team Building Events', 'Educational Programs', 'Cultural Events'
  ]

  const quickActions = [
    {
      title: 'Check Availability',
      description: 'See what dates are open for your event',
      href: '/availability',
      icon: Calendar,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Book Your Space',
      description: 'Reserve your perfect event venue online',
      href: '/booking',
      icon: Users,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Contact Us',
      description: 'Get answers to your questions',
      href: '/contact',
      icon: Phone,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'NNBA Partnership',
      description: 'Northern Neck Baptist Association',
      href: 'https://www.nnbaptist.org',
      icon: Heart,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      iconColor: 'text-red-600',
      external: true
    }
  ]

  const coreValues = [
    {
      icon: Heart,
      title: 'Christian Fellowship',
      description: 'Fostering community through faith-based gatherings and events'
    },
    {
      icon: Users,
      title: 'Community Service',
      description: 'Serving the Northern Neck community with excellence and care'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Providing top-quality facilities and exceptional service'
    },
    {
      icon: Shield,
      title: 'Accessibility',
      description: 'Welcoming spaces available to all community members'
    }
  ]

  return (
    <JRGrahamLayout currentPage="home">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Joseph R. Graham Center
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Premier Event Venue in the Heart of the Northern Neck
          </p>
          <div className="flex items-center justify-center text-lg mb-8">
            <MapPin className="w-6 h-6 mr-2" />
            <span>3989 White Chapel Road, Lively, VA 22507</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                <Calendar className="w-5 h-5 mr-2" />
                Book Your Event
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Can We Help You Today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.href}
                {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Card className={`${action.color} border-2 transition-all duration-200 hover:shadow-lg cursor-pointer h-full`}>
                  <CardContent className="p-6 text-center">
                    <action.icon className={`w-12 h-12 ${action.iconColor} mx-auto mb-4`} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Spaces */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Premier Event Spaces
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From intimate meetings to large celebrations, we have the perfect space for your event
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {spaces.map((space) => (
                <Card key={space.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                    {space.photos && space.photos.length > 0 && (
                      <img 
                        src={typeof space.photos[0] === 'string' ? space.photos[0] : space.photos[0].url}
                        alt={space.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{space.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{space.capacity} capacity</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-600">
                        ${space.price_per_hour}/hour
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {space.average_rating || 'New'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link href="/booking">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                View All Spaces
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on faith, dedicated to community, committed to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <value.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Event Types */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perfect for Every Occasion
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our versatile spaces accommodate a wide variety of events and celebrations
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {eventTypes.map((eventType, index) => (
              <div 
                key={index}
                className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center hover:bg-purple-100 transition-colors"
              >
                <span className="text-sm font-medium text-purple-800">
                  {eventType}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Plan Your Event?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Contact us today to discuss your event needs and check availability
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <a 
                href="tel:804-462-9011" 
                className="text-lg text-purple-600 hover:text-purple-700 font-medium"
              >
                804-462-9011
              </a>
            </div>
            
            <div className="text-center">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-lg text-gray-700">
                3989 White Chapel Road<br />
                Lively, VA 22507
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/availability">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Calendar className="w-5 h-5 mr-2" />
                  Check Availability
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </JRGrahamLayout>
  )
}
