import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer id="footer" className="w-full bg-[#020617] border-t border-white/10 pt-16 pb-8 px-4 md:px-12 mt-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#667eea] to-transparent opacity-50"></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
                {/* Brand Section */}
                <div className="flex flex-col gap-4">
                    <Link to="/" className="flex flex-col justify-center group w-auto leading-none mb-2">
                        <img src="/logo.png" alt="NovaTech" className="w-[150px] h-auto object-contain group-hover:scale-105 transition-transform origin-left" />
                    </Link>
                    <p className="text-slate-400 font-sans text-sm leading-relaxed max-w-xs">
                        {t('footer.about_text')}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#667eea] hover:border-transparent transition-all">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#667eea] hover:border-transparent transition-all">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#667eea] hover:border-transparent transition-all">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#667eea] hover:border-transparent transition-all">
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-display font-semibold text-lg">{t('footer.links')}</h3>
                    <ul className="flex flex-col gap-3">
                        <li><Link to="/" className="text-slate-400 hover:text-[#b5a6f2] transition-colors text-sm font-sans">{t('nav.home')}</Link></li>
                        <li><Link to="/?category=all" className="text-slate-400 hover:text-[#b5a6f2] transition-colors text-sm font-sans">{t('nav.categories')}</Link></li>
                        <li><Link to="/?category=all" className="text-slate-400 hover:text-[#b5a6f2] transition-colors text-sm font-sans">{t('nav.new_arrivals')}</Link></li>
                        <li><Link to="/?category=all" className="text-slate-400 hover:text-[#b5a6f2] transition-colors text-sm font-sans">{t('nav.promotions')}</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-display font-semibold text-lg">{t('footer.legal')}</h3>
                    <ul className="flex flex-col gap-3">
                        <li><a href="#" className="text-slate-400 hover:text-[#b5a6f2] transition-colors text-sm font-sans">{t('footer.privacy')}</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-[#b5a6f2] transition-colors text-sm font-sans">{t('footer.terms')}</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-display font-semibold text-lg">{t('nav.contact')}</h3>
                    <ul className="flex flex-col gap-4">
                        <li className="flex items-start gap-3 text-slate-400 text-sm font-sans">
                            <MapPin size={18} className="text-[#667eea] shrink-0 mt-0.5" />
                            <span>123 Innovation Drive, Tech District<br/>San Francisco, CA 94105</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-400 text-sm font-sans">
                            <Phone size={18} className="text-[#667eea] shrink-0" />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-400 text-sm font-sans">
                            <Mail size={18} className="text-[#667eea] shrink-0" />
                            <span>support@novatech.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-500 text-xs font-sans">
                    &copy; {new Date().getFullYear()} NovaTech. {t('footer.rights')}
                </p>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">VISA</div>
                    <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">MC</div>
                    <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">AMEX</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
