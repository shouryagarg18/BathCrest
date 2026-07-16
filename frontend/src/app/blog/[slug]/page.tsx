'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, BookOpen, ChevronRight, Share2 } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../posts';

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const currentPost = BLOG_POSTS.find(p => p.slug === slug);
    if (currentPost) {
      setPost(currentPost);
      // Get related posts (exclude current)
      const otherPosts = BLOG_POSTS.filter(p => p.slug !== slug);
      setRelated(otherPosts.slice(0, 2));
    } else {
      setPost(null);
    }
  }, [slug]);

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (post === null) {
    return (
      <div className="min-h-screen bg-[#0c0a09] text-white flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-md glass p-10 rounded-3xl">
          <BookOpen size={48} className="text-[#8b5e34] mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-white/50 mb-8">The blog article you are looking for does not exist or has been archived.</p>
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0c0a09] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8b5e34]" />
      </div>
    );
  }

  // Helper to render simple markdown sections (paragraphs and h3 titles)
  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-white font-bold text-xl md:text-2xl mt-8 mb-4">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('* ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={index} className="list-disc pl-6 my-4 space-y-2 text-white/70 leading-relaxed">
            {items.map((it, i) => (
              <li key={i}>{it.replace('* ', '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-white/70 leading-relaxed mb-6 text-base md:text-lg">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white pb-20">
      
      {/* Article Cover Banner */}
      <div className="relative w-full h-[50vh] min-h-[350px] md:h-[60vh] bg-black/60">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/30 to-black/40" />
        
        {/* Banner Details (Bottom-aligned) */}
        <div className="absolute bottom-0 left-0 right-0 py-10">
          <div className="section-container">
            {/* Category tag */}
            <span className="inline-block bg-[#8b5e34] text-white text-xs font-semibold px-3 py-1 rounded-md tracking-wider uppercase mb-4">
              {post.category}
            </span>
            
            {/* Title */}
            <h1 className="text-white font-bold text-3xl md:text-5xl lg:text-6xl max-w-4xl leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5e34] to-[#5c3a21] flex items-center justify-center text-white font-bold text-xs">
                  {post.author[0]}
                </div>
                <span>By {post.author}</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#8b5e34]" />
                <span>
                  {new Date(post.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#8b5e34]" />
                <span>{post.readTime}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="section-container mt-12">
        
        {/* Navigation & Utilities */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to articles
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8b5e34] hover:text-[#d4b895] transition-colors"
          >
            <Share2 size={14} />
            {copied ? 'Link Copied!' : 'Share Article'}
          </button>
        </div>

        {/* Content & Sidebar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main content body */}
          <div className="lg:col-span-2">
            <article className="prose prose-invert max-w-none">
              {renderContent(post.content)}
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Consultation Promo Card */}
            <div className="glass p-6 rounded-2xl border border-white/5 text-center relative overflow-hidden" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(139,94,52,0.1) 0%, transparent 60%)' }}>
              <div className="w-12 h-12 rounded-xl bg-[#8b5e34]/10 flex items-center justify-center text-[#8b5e34] mx-auto mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Need Design Help?</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-6">
                Connect with our expert design consultants to curate the perfect fixtures for your luxury sanctuary.
              </p>
              <Link href="/contact" className="btn-primary w-full py-2.5 text-xs font-semibold tracking-wider block">
                Book Consultation
              </Link>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-3">
                  Read Next
                </h4>
                <div className="space-y-4">
                  {related.map(p => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="group flex gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[#8b5e34] text-[10px] font-semibold uppercase tracking-wider mb-1">
                          {p.category}
                        </span>
                        <h5 className="font-semibold text-white text-sm line-clamp-2 leading-snug group-hover:text-[#8b5e34] transition-colors">
                          {p.title}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
