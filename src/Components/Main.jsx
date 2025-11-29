import React, { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Main() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [autoPlay, setAutoPlay] = useState(true)

    const slides = [
        {
            id: 1,
            title: "New: IELTS Writing is available!",
            image: "https://picsum.photos/800/400?random=1",
            description: "Master your writing skills"
        },
        {
            id: 2,
            title: "CEFR Listening Course Updated",
            image: "https://picsum.photos/800/400?random=2",
            description: "Improve your listening abilities"
        },
        {
            id: 3,
            title: "Speaking Practice Sessions",
            image: "https://picsum.photos/800/400?random=3",
            description: "Enhance your pronunciation"
        },
        {
            id: 4,
            title: "Reading Comprehension Guide",
            image: "https://picsum.photos/800/400?random=4",
            description: "Ace your reading tests"
        }
    ]

    useEffect(() => {
        if (!autoPlay) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [autoPlay, slides.length])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setAutoPlay(false)
        setTimeout(() => setAutoPlay(true), 5000)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        setAutoPlay(false)
        setTimeout(() => setAutoPlay(true), 5000)
    }

    const goToSlide = (index) => {
        setCurrentSlide(index)
        setAutoPlay(false)
        setTimeout(() => setAutoPlay(true), 5000)
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-lg'>
            <section className="news w-full h-max flex flex-col gap-6">
                {/* Header */}
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-gray-800 dark:text-white">What's New</h3>
                    <p className="text-gray-600 dark:text-gray-400">Check out our latest course updates and features</p>
                </div>

                {/* Carousel Container */}
                <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl dark:shadow-cyan-500/20 group">
                    {/* Slides */}
                    <div className="relative w-full h-full">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${
                                    index === currentSlide 
                                        ? 'opacity-100 scale-100' 
                                        : 'opacity-0 scale-95'
                                }`}
                            >
                                {/* Background Image */}
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className='w-full h-full object-cover'
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                    <div className="space-y-3 animate-fade-in">
                                        <p className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Featured</p>
                                        <h2 className="text-4xl font-bold leading-tight">{slide.title}</h2>
                                        <p className="text-lg text-gray-200">{slide.description}</p>
                                        <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 w-fit">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronLeft size={20} />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronRight size={20} />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full backdrop-blur-md ${
                                    index === currentSlide
                                        ? 'bg-white w-8 h-3'
                                        : 'bg-white/50 hover:bg-white/70 w-3 h-3'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Slide Counter */}
                    <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {currentSlide + 1} / {slides.length}
                    </div>
                </div>

                {/* Info Cards Below */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            onClick={() => goToSlide(index)}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:shadow-md'
                            }`}
                        >
                            <h4 className="font-semibold text-sm">{slide.title}</h4>
                            <p className={`text-xs mt-2 ${index === currentSlide ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                                {slide.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}