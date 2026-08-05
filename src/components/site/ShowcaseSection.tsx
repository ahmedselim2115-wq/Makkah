// المسار: src/components/site/ShowcaseSection.tsx
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Hotspot {
  id: string;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  icon?: string | null;
  positionX: number;
  positionY: number;
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
  isAdmin?: boolean; // خاصية لتفعيل وضع التعديل والإضافة
  onEditProduct?: (product: ShowcaseProduct) => void;
  onAddHotspot?: (productId: string, coords: { x: number; y: number }) => void;
}

export default function ShowcaseSection({ 
  settings, 
  isAdmin = false, 
  onEditProduct,
  onAddHotspot 
}: ShowcaseSectionProps) {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";
  const dir = isEn ? "ltr" : "rtl";

  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
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

  const activeProduct = products[activeIndex];

  const getName = (p: ShowcaseProduct) => (isEn && p.nameEn ? p.nameEn : p.name);
  const getTitle = (h: Hotspot) => (isEn && h.titleEn ? h.titleEn : h.title);
  const getDescription = (h: Hotspot) =>
    isEn && h.descriptionEn ? h.descriptionEn : h.description;

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

    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
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

  // ميزة إضافة نقطة جديدة عند النقر في وضع الـ Admin
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin || !stageRef.current || !activeProduct) return;
    // عدم تفعيل النقر إذا كان الهدف هو زر أو نقطة موجودة مسبقاً
    if ((e.target as HTMLElement).closest("button")) return;

    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (onAddHotspot) {
      onAddHotspot(activeProduct.id, { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
    }
  };

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
        <div className="text-center mb-6 flex items-center justify-center gap-3">
          <h3 className="text-xl md:text-2xl font-semibold text-white transition-all duration-300">
            {getName(activeProduct)}
          </h3>
          {isAdmin && onEditProduct && (
            <button
              onClick={() => onEditProduct(activeProduct)}
              className="p-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors"
              title="تعديل المنتج"
            >
              <Edit size={16} />
            </button>
          )}
        </div>

        <div
          ref={stageRef}
          onClick={handleStageClick}
          className={`relative bg-slate-900/60 border border-slate-800 h-[400px] sm:h-[500px] md:h-[80vh] flex items-center justify-center overflow-hidden ${
            isAdmin ? "cursor-crosshair" : ""
          }`}
        >
          <div className="relative w-full h-full transition-all duration-1000 ease-out">
            <img
              src={activeProduct.image}
              alt={getName(activeProduct)}
              className="w-full h-full object-cover object-center drop-shadow-2xl select-none pointer-events-none"
              draggable={false}
            />

            {activeProduct.hotspots.map((h) => (
              <button
                key={h.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setDragOffset({ x: 0, y: 0 });
                  setActiveHotspot(activeHotspot === h.id ? null : h.id);
                }}
                style={{ left: `${h.positionX}%`, top: `${h.positionY}%` }}
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

          {/* أزرار التنقل */}
          <button
            onClick={() => goTo(isEn ? activeIndex - 1 : activeIndex + 1)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => goTo(isEn ? activeIndex + 1 : activeIndex - 1)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center border border-slate-700"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}