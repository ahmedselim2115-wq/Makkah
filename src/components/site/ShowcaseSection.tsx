// المسار: src/components/site/ShowcaseSection.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getContainedImageRect } from "@/lib/imageFit";

interface Hotspot {
  id: string;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  icon?: string | null;
  positionX: number; // 0-100
  positionY: number; // 0-100
}

interface ShowcaseProduct {
  id: string;
  name: string;
  nameEn?: string | null;
  image: string;
  hotspots: Hotspot[];
}

import type { SiteSettings } from "@/lib/types";

interface ShowcaseSectionProps {
  settings?: SiteSettings | null;
}

export default function ShowcaseSection({ settings }: ShowcaseSectionProps) {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";
  const dir = isEn ? "ltr" : "rtl";

  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const [imgRect, setImgRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const updateImgRect = () => {
    if (!stageRef.current || !imgElRef.current?.naturalWidth) return;
    const c = stageRef.current.getBoundingClientRect();
    setImgRect(
      getContainedImageRect(
        c.width,
        c.height,
        imgElRef.current.naturalWidth,
        imgElRef.current.naturalHeight
      )
    );
  };
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/showcase")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch((err) => console.error("فشل تحميل منتجات العرض:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const activeProduct = products[activeIndex];   // ✅ هنا دلوقتي

  useEffect(() => {
    updateImgRect();
    window.addEventListener("resize", updateImgRect);
    return () => window.removeEventListener("resize", updateImgRect);
  }, [activeProduct?.image]);
 

  const getName = (p: ShowcaseProduct) => (isEn && p.nameEn ? p.nameEn : p.name);
  const getTitle = (h: Hotspot) => (isEn && h.titleEn ? h.titleEn : h.title);
  const getDescription = (h: Hotspot) =>
    isEn && h.descriptionEn ? h.descriptionEn : h.description;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 20;
    const rotateX = (0.5 - py) * 14;
    setTilt({ x: rotateX, y: rotateY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });
  const cardOrigin = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [lineEnd, setLineEnd] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const cardRect = e.currentTarget.getBoundingClientRect();
    cardOrigin.current = {
      x: cardRect.left - dragOffset.x,
      y: cardRect.top - dragOffset.y,
    };
    dragStart.current = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!isDragging || !stageRef.current) return;

      const stageRect = stageRef.current.getBoundingClientRect();
      const cardWidth = cardRef.current?.offsetWidth || 288;
      const cardHeight = 180;
      const margin = 16;

      let newX = e.clientX - dragStart.current.x;
      let newY = e.clientY - dragStart.current.y;

      const minX = stageRect.left - cardOrigin.current.x + margin;
      const maxX = stageRect.right - cardOrigin.current.x - cardWidth - margin;
      const minY = stageRect.top - cardOrigin.current.y + margin;
      const maxY = stageRect.bottom - cardOrigin.current.y - cardHeight - margin;

      newX = Math.min(Math.max(newX, minX), maxX);
      newY = Math.min(Math.max(newY, minY), maxY);

      setDragOffset({ x: newX, y: newY });
    };
    const handleDragEnd = () => setIsDragging(false);

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      handleDragMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  useLayoutEffect(() => {
    if (!activeHotspot || !cardRef.current || !stageRef.current) return;
    const hotspot = activeProduct?.hotspots.find((h) => h.id === activeHotspot);
    if (!hotspot) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    const x = cardRect.left + cardRect.width / 2;
    const y = cardRect.top;

    setLineEnd({
      x: x - stageRect.left,
      y: y - stageRect.top,
    });
  }, [dragOffset, activeHotspot, activeProduct]);

  const goTo = (index: number) => {
    setActiveHotspot(null);
    setDragOffset({ x: 0, y: 0 });
    setActiveIndex((index + products.length) % products.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center text-slate-400">
        {t("showcase_loading")}
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section
      ref={sectionRef}
      dir={dir}
      className="relative w-full py-6 md:py-8 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto text-center mb-4 md:mb-6 px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
          {(isEn ? settings?.showcaseTitleEn : settings?.showcaseTitle)?.trim() || t("showcase_title")}
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          {(isEn ? settings?.showcaseSubtitleEn : settings?.showcaseSubtitle)?.trim() || t("showcase_subtitle")}
        </p>
      </div>

      <div className="relative w-full">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-white transition-all duration-300">
            {getName(activeProduct)}
          </h3>
        </div>

        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          className="relative bg-slate-900/60 border border-slate-800 h-[400px] sm:h-[500px] md:h-[80vh] flex items-center justify-center overflow-hidden"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full h-full transition-all duration-1000 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? `translateY(0) scale(1)`
                : `translateY(48px) scale(0.9)`,
            }}
          >
            <img
                ref={imgElRef}
                src={activeProduct.image}
                alt={getName(activeProduct)}
                onLoad={updateImgRect}
                className="w-full h-full object-contain object-center drop-shadow-2xl select-none pointer-events-none"
                draggable={false}
              />

            {activeHotspot &&
              activeProduct.hotspots
                .filter((h) => h.id === activeHotspot)
                .map((h) => (
                  <svg
                    key={`line-${h.id}`}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  >
                    <line
                      x1={imgRect.left + (h.positionX / 100) * imgRect.width}
                      y1={imgRect.top + (h.positionY / 100) * imgRect.height}
                      x2={lineEnd.x}
                      y2={lineEnd.y}
                      stroke="rgba(15, 40, 70, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="4 5"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={lineEnd.x}
                      cy={lineEnd.y}
                      r="3"
                      fill="rgba(96, 165, 250, 0.9)"
                    />
                  </svg>
                ))}

            {activeProduct.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setDragOffset({ x: 0, y: 0 });
                  setActiveHotspot(activeHotspot === h.id ? null : h.id);
                }}
                style={{
                  left: `${imgRect.left + (h.positionX / 100) * imgRect.width}px`,
                  top: `${imgRect.top + (h.positionY / 100) * imgRect.height}px`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <span className="relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60 animate-ping" />
                  <span className="relative inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-transform">
                    <Plus size={12} className="md:w-4 md:h-4" />
                  </span>
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => goTo(isEn ? activeIndex + 1 : activeIndex - 1)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700"
            aria-label={t("showcase_prev")}
          >
            <ChevronRight size={16} className="md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => goTo(isEn ? activeIndex - 1 : activeIndex + 1)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700"
            aria-label={t("showcase_next")}
          >
            <ChevronLeft size={16} className="md:w-5 md:h-5" />
          </button>

          {activeProduct.hotspots
            .filter((h) => h.id === activeHotspot)
            .map((h) => (
              <div
                ref={cardRef}
                key={h.id}
                dir={dir}
                className={`absolute z-40 w-[85vw] max-w-72 bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl p-4 md:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-300 ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                 style={{
                  left: `${imgRect.left + (Math.min(Math.max(h.positionX, 20), 80) / 100) * imgRect.width}px`,
                  top: `${imgRect.top + (Math.min(Math.max(h.positionY, 15), 70) / 100) * imgRect.height}px`,
                  transform: `translate(calc(-50% + ${dragOffset.x}px), calc(20px + ${dragOffset.y}px))`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
                onMouseDown={handleDragStart}
                onTouchStart={(e) => handleDragStart(e as any)}
              >
                <div className="absolute top-0 right-4 left-4 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-transparent rounded-full" />

                <button
                  onClick={() => {
                    setDragOffset({ x: 0, y: 0 });
                    setActiveHotspot(null);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-3 left-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full p-1 transition-colors"
                >
                  <X size={14} />
                </button>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mt-0.5">
                    <Plus size={14} className="text-blue-400" />
                  </span>
                  <div className="flex-1 pl-2">
                    <h4 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-1.5">
                      {getTitle(h)}
                    </h4>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      {getDescription(h)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-8 bg-blue-500"
                  : "w-2.5 bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={getName(p)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 overflow-x-auto pb-2">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              className={`shrink-0 w-16 h-16 rounded-xl border-2 p-1 bg-slate-800/60 transition-all ${
                i === activeIndex
                  ? "border-blue-500"
                  : "border-slate-700 hover:border-slate-500"
              }`}
            >
              <img src={p.image} alt={getName(p)} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}