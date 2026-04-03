import { Link } from 'react-router-dom';
import { Sparkles, FileText, Mic2, Brain, ArrowRight, Check, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-body">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-cream-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-500 flex items-center justify-center shadow-sm">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-charcoal-800">ResumeAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-sage-600 hover:text-sage-700 px-4 py-2">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm py-2.5 px-5">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-50 border border-sage-200 rounded-full text-sm text-sage-600 font-medium mb-8">
          <Sparkles size={14} />
          Powered by Google Gemini AI
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-semibold text-charcoal-800 leading-tight mb-6">
          Land your dream job<br />
          <span className="italic text-sage-500">with AI confidence</span>
        </h1>
        <p className="text-lg text-sage-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your resume, get AI-powered feedback, and practice interviews with our intelligent simulator. 
          Turn your career goals into reality.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base py-4 px-8">
            Start for free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base py-4 px-8">Sign in</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: 'Smart Resume Analysis', desc: 'Upload your PDF and get instant AI feedback on structure, keywords, and impact score.', color: 'bg-sage-50 text-sage-500' },
            { icon: Mic2, title: 'Interview Simulator', desc: 'Practice with AI-generated questions tailored to your resume and target role.', color: 'bg-warm-50 text-warm-500' },
            { icon: Brain, title: 'Deep Career Insights', desc: 'Get personalized suggestions to improve your chances and stand out from the crowd.', color: 'bg-cream-200 text-charcoal-800' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-7">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-800 mb-2">{title}</h3>
              <p className="text-sm text-sage-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-y border-cream-200 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-charcoal-800 mb-12">Loved by job seekers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', role: 'Software Engineer', text: 'Got my score from 58 to 91 after using the AI feedback. Landed 3 interviews in a week!' },
              { name: 'Arjun M.', role: 'Product Manager', text: 'The interview simulator felt so real. The questions were exactly what I faced in my actual interviews.' },
              { name: 'Sneha K.', role: 'Data Analyst', text: 'Best investment I made in my job search. The resume analysis spotted gaps I never noticed.' },
            ].map(({ name, role, text }) => (
              <div key={name} className="card p-6 text-left">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-warm-400 fill-warm-400" />)}
                </div>
                <p className="text-sm text-charcoal-800 leading-relaxed mb-4">"{text}"</p>
                <div>
                  <p className="text-sm font-semibold text-charcoal-800">{name}</p>
                  <p className="text-xs text-sage-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl font-semibold text-charcoal-800 mb-4">Ready to get started?</h2>
        <p className="text-sage-400 mb-8">Join thousands of job seekers who use ResumeAI to land their dream roles.</p>
        <Link to="/register" className="btn-primary text-base py-4 px-10">
          Create free account <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-200 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-sage-500 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="font-display font-semibold text-charcoal-800">ResumeAI</span>
        </div>
        <p className="text-xs text-sage-400">© 2025 ResumeAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
