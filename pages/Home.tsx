import React from 'react';
import { Hero } from '../components/Hero';
import { PRODUCTS } from '../data';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { ProductCanvas } from '../components/ProductCanvas';
import { HolographicCard } from '../components/HolographicCard';
import { SplitText } from '../components/SplitText';
import { HorizontalScrollSection } from '../components/HorizontalScrollSection';
import { LuxuryButton } from '../components/LuxuryButton';
import { ViewState } from '../types';
import { NoiseOverlay } from '../components/NoiseOverlay';
import { AudioPlayer } from '../components/AudioPlayer';

interface HomeProps {
    onNavigate: (view: ViewState) => void;
    onProductClick: (product: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onProductClick }) => {

    // Section 1: Hoodies & Sweatshirts
    const upperWear = PRODUCTS.filter(p => p.category === 'Hoodies' || p.category === 'Sweatshirts');

    // Section 2: Trousers, Cargos, Denim
    const bottoms = PRODUCTS.filter(p => p.category === 'Trousers' || p.category === 'Cargos' || p.category === 'Denim');

    // Section 3: Jackets & Polos
    const icons = PRODUCTS.filter(p => p.category === 'Jackets' || p.category === 'Tops');

    return (
        <div className="w-full relative bg-transparent text-brand-white">
            <Hero onExplore={() => onNavigate('SHOP')} />

            {/* --- MANIFESTO --- */}
            <section className="py-24 md:py-32 px-6 flex justify-center bg-transparent relative">
                <div className="max-w-3xl text-center z-10">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-brand-gold text-[10px] uppercase tracking-[0.3em] block mb-6 font-medium"
                    >
                        The Philosophy
                    </motion.span>

                    <div className="text-2xl md:text-4xl lg:text-5xl font-serif leading-tight text-brand-white/90">
                        <SplitText delay={0.2}>
                            "Engineered for the modern void."
                        </SplitText>
                        <div className="h-4" />
                        <SplitText delay={0.6} className="text-brand-gray/80">
                            "Structure, Silence, and Form."
                        </SplitText>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-10 flex justify-center"
                    >
                        <ArrowDown className="text-brand-white/20 w-5 h-5 animate-bounce" />
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 1: THE HEAVYWEIGHTS (Hoodies/Sweats) --- */}
            <section className="py-20 px-6 md:px-12 max-w-[1400px] mx-auto bg-transparent">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/5 pb-6">
                    <div>
                        <h3 className="text-4xl md:text-5xl font-serif text-brand-white mb-3">
                            <SplitText>The Heavyweights</SplitText>
                        </h3>
                        <p className="text-brand-gray text-xs uppercase tracking-[0.2em]">400GSM Cotton Program</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <LuxuryButton onClick={() => onNavigate('SHOP')}>
                            View Collection
                        </LuxuryButton>
                    </div>
                </div>

                {/* Grid with larger vertical gaps for luxury feel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-20 justify-items-center">
                    {upperWear.map((product, idx) => (
                        <div key={product.id} className="w-full flex justify-center">
                            <HolographicCard onClick={() => onProductClick(product)}>
                                {/* We wrap the existing ProductCard inner content or reuse it */}
                                <ProductCard
                                    product={product}
                                    onClick={() => { }} // Handled by HolographicCard
                                    index={idx}
                                />
                            </HolographicCard>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION 2: BOTTOMS SCROLL (Trousers/Cargos/Denim) --- */}
            <HorizontalScrollSection
                title="Foundation"
                subtitle="Trousers, Cargos & Denim. Engineered for durability."
                products={bottoms}
                onProductClick={onProductClick}
            />

            {/* --- SECTION 3: THE ICONS (Jackets/Polos) --- */}
            <section className="py-24 px-6 md:px-12 bg-black/40 backdrop-blur-sm relative overflow-hidden">
                {/* Background Detail */}
                <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full border border-brand-gold" />
                </div>

                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-20">
                        <h3 className="text-4xl md:text-6xl font-serif mb-4">Icons & Outerwear</h3>
                        <p className="text-brand-gray uppercase tracking-widest text-xs">Mercerized Polos & Vintage Leather</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Feature Product 1 (Jacket) */}
                        {icons.find(p => p.category === 'Jackets') && (
                            <HolographicCard className="relative max-w-sm mx-auto md:max-w-none md:mx-0" onClick={() => onProductClick(icons.find(p => p.category === 'Jackets'))}>
                                <div className="aspect-[3/4] overflow-hidden bg-brand-black border border-white/5 relative">
                                    {/* Replaced generic img with ProductCanvas for 3D effect */}
                                    <div className="w-full h-full">
                                        <ProductCanvas
                                            src={icons.find(p => p.category === 'Jackets')?.image || ''}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                                <div className="p-6 text-center md:text-left bg-black/80 backdrop-blur-md absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-2xl font-serif mb-2">{icons.find(p => p.category === 'Jackets')?.name}</h4>
                                    <p className="text-sm text-brand-gray mb-6 max-w-sm">{icons.find(p => p.category === 'Jackets')?.details?.[0]}</p>
                                </div>
                            </HolographicCard>
                        )}

                        {/* Feature Product 2 (Polo) */}
                        {icons.find(p => p.category === 'Tops') && (
                            <HolographicCard className="relative mt-12 md:mt-0 md:translate-y-12 max-w-sm mx-auto md:max-w-none md:mx-0" onClick={() => onProductClick(icons.find(p => p.category === 'Tops'))}>
                                <div className="aspect-[3/4] overflow-hidden bg-brand-black border border-white/5">
                                    <img
                                        src={icons.find(p => p.category === 'Tops')?.image}
                                        alt="Feature Polo"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                    />
                                </div>
                                <div className="p-6 text-center md:text-left bg-black/80 backdrop-blur-md absolute bottom-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-2xl font-serif mb-2">{icons.find(p => p.category === 'Tops')?.name}</h4>
                                </div>
                            </HolographicCard>
                        )}
                    </div>

                    {/* Remaining Icons Grid - Centered & Spaced */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 mt-32 justify-items-center">
                        {icons.filter(p => p !== icons.find(p => p.category === 'Jackets') && p !== icons.find(p => p.category === 'Tops')).map((item, i) => (
                            <HolographicCard key={item.id} onClick={() => onProductClick(item)}>
                                <ProductCard product={item} onClick={() => { }} index={i} />
                            </HolographicCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA --- */}
            <section className="py-32 px-6 text-center bg-black/60 border-t border-white/5">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-white mb-6">Join the Vanguard</h2>
                <p className="text-brand-gray max-w-lg mx-auto mb-10 font-light text-sm">
                    Be the first to access limited releases and private showrooms.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        className="bg-transparent border-b border-white/20 py-3 px-2 w-full max-w-xs text-center text-brand-white focus:outline-none focus:border-brand-gold transition-colors placeholder-white/20 font-sans tracking-widest text-xs"
                    />
                    <button className="text-brand-gold uppercase tracking-[0.2em] text-xs hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                        Subscribe
                    </button>
                </div>
            </section>
        </div>
    );
};