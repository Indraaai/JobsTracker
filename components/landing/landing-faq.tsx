"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        q: "Apakah JobTracker ini gratis digunakan?",
        a: "Ya, 100% gratis! Tidak ada biaya berlangganan, batasan jumlah lamaran, atau iklan yang mengganggu.",
    },
    {
        q: "Bagaimana cara kerja sinkronisasi Google Calendar?",
        a: "Sangat mudah dan tanpa perlu otorisasi akun rumit. Cukup klik tombol 'Add to Calendar' di jadwal interview mana pun, web akan membuka Google Calendar dengan judul, tanggal/jam, tautan Google Meet/Zoom, dan catatan yang sudah terisi otomatis.",
    },
    {
        q: "Apakah data lamaran dan kontak saya aman?",
        a: "Data Anda disimpan secara privat di database terenkripsi dan terikat langsung ke akun pengguna Anda. Tidak ada pihak luar yang dapat melihat lamaran atau catatan Anda.",
    },
    {
        q: "Bisakah saya menggunakan aplikasi ini di smartphone/mobile?",
        a: "Bisa! Seluruh antarmuka JobTracker dibangun sepenuhnya responsif untuk layar HP, tablet, maupun monitor desktop.",
    },
    {
        q: "Bagaimana jika saya ingin menambahkan kontak recruiter yang belum terdaftar di perusahaan?",
        a: "Anda dapat menambahkan kontak secara bebas dan menghubungkannya ke perusahaan yang sudah ada atau menyimpannya secara independen di menu Contacts.",
    },
];

export default function LandingFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <section id="faq" className="py-16 border-t bg-muted/10">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                        <HelpCircle className="h-3.5 w-3.5" />
                        <span>FAQ</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Pertanyaan yang Sering Diajukan
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="rounded-xl border bg-card overflow-hidden shadow-2xs transition-all"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(idx)}
                                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-foreground hover:bg-muted/30 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                                            isOpen ? "rotate-180 text-primary" : ""
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
