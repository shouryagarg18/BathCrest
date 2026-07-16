'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from './posts';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Buying Guides', 'Design Trends', 'Maintenance'];

  const filteredPosts = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white">
      {/* Hero Header */}
      <section className="section-py relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,94,52,0.15) 0%, #0c0a09 70%)' }}>
        <div className="section-container text-center py-10">
          <div className="text-[#8b5e34] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <BookOpen size={16} /> BathCrest Journal
          </div>
          <h1 className="section-heading text-gradient mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.2' }}>
            Design Inspiration &<br />Expert Bathroom Guides
          </h1>
          <p className="section-subheading max-w-2xl mx-auto">
            Discover architectural design principles, step-by-step buying guides, and crucial hardware maintenance tips curated by our design consultants.
          </p>
        </div>
      </section>

      {/* Blog Grid & Filters */}
      <section className="section-py" style={{ paddingTop: 0 }}>
        <div className="section-container">
          
          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#8b5e34] text-white shadow-lg shadow-[#8b5e34]/20 border border-[#8b5e34]'
                    : 'bg-white/5 text-white/60 border border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <article
                key={post.id}
                className="group relative flex flex-col glass rounded-2xl overflow-hidden hover:border-[#8b5e34]/30 hover:bg-white/[0.06] transition-all duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Image Wrap */}
                <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-black/40">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/80 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-4 left-4 bg-[#8b5e34]/90 text-white text-xs font-semibold px-3 py-1 rounded-md tracking-wider uppercase backdrop-blur-md">
                    {post.category}
                  </span>
                </Link>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#8b5e34]" />
                        {new Date(post.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-[#8b5e34]" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white text-xl mb-3 line-clamp-2 group-hover:text-[#8b5e34] transition-colors duration-300">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  {/* Footer Meta & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-bold text-xs">
                        {post.author[0]}
                      </div>
                      <span className="text-white/60 text-xs font-medium">{post.author}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-[#8b5e34] text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                    >
                      Read Article <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20 glass rounded-3xl">
              <BookOpen size={48} className="text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
              <p className="text-white/40">We are currently drafting new articles in this category. Check back soon!</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
