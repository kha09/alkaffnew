import db from '@/lib/db'
import { HomePageContent, HeroSlide, University, Testimonial, Faq } from '@/lib/types'

export async function getHomepageContent(): Promise<HomePageContent> {
  try {
    // Fetch all content types from the database
    const [heroSlides, universities, testimonials, faqs] = await Promise.all([
      db.heroSlide.findMany({ orderBy: { order: 'asc' } }),
      db.university.findMany({ orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.faq.findMany({ orderBy: { order: 'asc' } }),
    ])

    // If no content exists, return empty arrays
    if (!heroSlides.length && !universities.length && !testimonials.length && !faqs.length) {
      return {
        heroSlides: [],
        universities: [],
        testimonials: [],
        faqs: [],
      }
    }

    return {
      heroSlides: heroSlides.map(slide => ({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        image: slide.image,
        gradient: slide.gradient,
      })),
      universities: universities.map(university => ({
        name: university.name,
        country: university.country,
        logo: university.logo,
        ranking: university.ranking,
        students: university.students,
        programs: university.programs,
        acceptance: university.acceptance,
        color: university.color,
        flag: university.flag,
      })),
      testimonials: testimonials.map(testimonial => ({
        id: testimonial.id,
        name: testimonial.name,
        program: testimonial.program,
        text: testimonial.text,
        rating: testimonial.rating,
        avatar: testimonial.avatar,
        university: testimonial.university,
        country: testimonial.country,
        flag: testimonial.flag,
        date: testimonial.date,
        hasVideo: testimonial.hasVideo,
        featured: testimonial.featured,
        category: testimonial.category,
      })),
      faqs: faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        popular: faq.popular,
      })),
    }
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    throw new Error('Failed to fetch homepage content')
  }
}

export async function updateHomepageContent(content: HomePageContent): Promise<void> {
  try {
    // Start a transaction to ensure data consistency
    await db.$transaction(async (prisma) => {
      // Delete all existing content
      await prisma.heroSlide.deleteMany()
      await prisma.university.deleteMany()
      await prisma.testimonial.deleteMany()
      await prisma.faq.deleteMany()

      // Create new hero slides
      await prisma.heroSlide.createMany({
        data: content.heroSlides.map((slide, index) => ({
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          image: slide.image,
          gradient: slide.gradient,
          order: index,
        })),
      })

      // Create new universities
      await prisma.university.createMany({
        data: content.universities.map((university, index) => ({
          name: university.name,
          country: university.country,
          logo: university.logo,
          ranking: university.ranking,
          students: university.students,
          programs: university.programs,
          acceptance: university.acceptance,
          color: university.color,
          flag: university.flag,
          order: index,
        })),
      })

      // Create new testimonials
      await prisma.testimonial.createMany({
        data: content.testimonials.map((testimonial, index) => ({
          name: testimonial.name,
          program: testimonial.program,
          text: testimonial.text,
          rating: testimonial.rating,
          avatar: testimonial.avatar,
          university: testimonial.university,
          country: testimonial.country,
          flag: testimonial.flag,
          date: testimonial.date,
          hasVideo: testimonial.hasVideo,
          featured: testimonial.featured,
          category: testimonial.category,
          order: index,
        })),
      })

      // Create new FAQs
      await prisma.faq.createMany({
        data: content.faqs.map((faq, index) => ({
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          popular: faq.popular,
          order: index,
        })),
      })
    })
  } catch (error) {
    console.error('Error updating homepage content:', error)
    throw new Error('Failed to update homepage content')
  }
}

export async function initializeDefaultContent(): Promise<void> {
  try {
    const content = await getHomepageContent()
    
    // Check if content already exists
    if (content.heroSlides.length > 0 || 
        content.universities.length > 0 || 
        content.testimonials.length > 0 || 
        content.faqs.length > 0) {
      return
    }

    // Load default content from the data file
    const defaultContent = await import('@/data/homepage-content.json')
    
    // Save default content to database
    await updateHomepageContent(defaultContent.default || defaultContent)
  } catch (error) {
    console.error('Error initializing default content:', error)
  }
}
