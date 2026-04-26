"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logosijempol.jpeg"
                            alt="SiJempol Humanis Logo"
                            width={40}
                            height={40}
                            className="rounded-lg"
                            priority
                        />
                        <div>
                            <span className="text-lg font-bold">SiJempol</span>
                            <span className="ml-2 text-sm text-muted-foreground">Humanis</span>
                        </div>
                    </Link>

                    <Button asChild variant="ghost" className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Kebijakan Privasi</h1>
                    <p className="text-muted-foreground">
                        Dinas Kependudukan dan Pencatatan Sipil Kota Tegal
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
                    </p>
                </div>

                <div className="prose prose-sm max-w-none space-y-6 text-foreground">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. Pengantar</h2>
                        <p>
                            Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil) Kota Tegal berkomitmen untuk melindungi privasi dan keamanan data pribadi pengguna Sistem SiJempol Humanis (selanjutnya disebut "Sistem"). Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi Anda.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Data Pribadi yang Kami Kumpulkan</h2>
                        <p>Kami mengumpulkan data pribadi dalam konteks memberikan layanan kependudukan dan pencatatan sipil, meliputi:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Informasi Identitas: Nama lengkap, Nomor Induk Kependudukan (NIK), tanggal lahir, jenis kelamin, tempat lahir, agama, dan status perkawinan</li>
                            <li>Informasi Kontak: Alamat email, nomor telepon/WhatsApp, dan alamat tempat tinggal</li>
                            <li>Informasi Profesional: Data pekerjaan dan pendidikan (jika relevan dengan layanan)</li>
                            <li>Dokumen Pendukung: Scan atau foto dokumen yang diperlukan untuk proses administrasi</li>
                            <li>Informasi Teknis: Alamat IP, tipe perangkat, browser yang digunakan, dan data aktivitas pengguna</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Tujuan Pengumpulan Data</h2>
                        <p>Data pribadi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Memberikan layanan kependudukan dan pencatatan sipil sesuai dengan peraturan perundang-undangan</li>
                            <li>Memproses permohonan dan verifikasi dokumen kependudukan</li>
                            <li>Membantu penelusuran status permohonan layanan</li>
                            <li>Menyampaikan informasi tentang jadwal layanan keliling</li>
                            <li>Merespons aspirasi, pertanyaan, dan keluhan dari pengguna</li>
                            <li>Meningkatkan kualitas layanan dan sistem informasi</li>
                            <li>Mematuhi kewajiban hukum dan regulasi pemerintah</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Keamanan Data</h2>
                        <p>
                            Kami menerapkan berbagai langkah keamanan teknis dan organisasi untuk melindungi data pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghapusan yang tidak sah:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Enkripsi data dalam transit dan saat disimpan (SSL/TLS)</li>
                            <li>Kontrol akses yang ketat dengan autentikasi pengguna</li>
                            <li>Audit keamanan berkala dan penetration testing</li>
                            <li>Backup data reguler untuk memastikan ketersediaan data</li>
                            <li>Pelatihan keamanan informasi untuk semua staf</li>
                            <li>Kebijakan akses data berdasarkan prinsip least privilege</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Penyimpanan Data</h2>
                        <p>
                            Data pribadi disimpan di server yang berlokasi di Indonesia, dikelola oleh Disdukcapil Kota Tegal. Kami menyimpan data pribadi Anda selama diperlukan untuk memberikan layanan dan memenuhi kewajiban hukum. Data akan dihapus atau dianonimkan sesuai dengan peraturan penghapusan data yang berlaku.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Berbagi Data dengan Pihak Ketiga</h2>
                        <p>
                            Kami dapat membagikan data pribadi Anda dengan pihak ketiga hanya dalam situasi berikut:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Untuk memenuhi persyaratan hukum atau perintah pengadilan</li>
                            <li>Dengan instansi pemerintah lain yang memerlukan data untuk pelaksanaan tugas resmi</li>
                            <li>Dengan penyedia layanan yang membantu kami dalam memberikan layanan (di bawah perjanjian keamanan data)</li>
                            <li>Dengan izin tertulis dari Anda untuk tujuan spesifik</li>
                        </ul>
                        <p className="mt-4">
                            Kami tidak menjual, menukar, atau menyewakan data pribadi Anda kepada pihak ketiga untuk tujuan komersial.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Hak Pengguna</h2>
                        <p>Anda memiliki hak-hak berikut terkait data pribadi Anda:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Hak Akses: Mengetahui data pribadi apa yang kami simpan tentang Anda</li>
                            <li>Hak Koreksi: Meminta perbaikan data yang tidak akurat atau tidak lengkap</li>
                            <li>Hak Penghapusan: Meminta penghapusan data dalam kondisi tertentu yang sesuai hukum</li>
                            <li>Hak Portabilitas: Meminta data Anda dalam format yang dapat dibaca mesin</li>
                            <li>Hak Keberatan: Menolak pemrosesan data untuk tujuan tertentu</li>
                        </ul>
                        <p className="mt-4">
                            Untuk menggunakan hak-hak ini, hubungi kami melalui alamat email atau nomor telepon yang tercantum di akhir dokumen ini.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Cookie dan Teknologi Pelacakan</h2>
                        <p>
                            Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman pengguna. Cookie ini menyimpan preferensi Anda dan membantu kami memahami bagaimana pengguna menggunakan Sistem. Anda dapat mengontrol pengaturan cookie melalui pengaturan browser Anda.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Retensi Data</h2>
                        <p>
                            Kami menyimpan data pribadi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, termasuk:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Data KTP: Disimpan sesuai dengan peraturan tentang Administrasi Kependudukan</li>
                            <li>Data Akta Kelahiran: Disimpan sesuai dengan peraturan tentang Pencatatan Sipil</li>
                            <li>Log Sistem: Disimpan selama 1 tahun untuk keperluan audit dan keamanan</li>
                            <li>Aspirasi Warga: Disimpan selama 2 tahun untuk keperluan evaluasi layanan</li>
                        </ul>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Perubahan Kebijakan Privasi</h2>
                        <p>
                            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu untuk mencerminkan perubahan dalam praktik kami, teknologi, peraturan, atau pertimbangan lain. Kami akan memberitahu Anda tentang perubahan material melalui email atau pemberitahuan di Sistem.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">11. Kontak Kami</h2>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak-hak Anda terkait data pribadi, silakan hubungi kami:
                        </p>
                        <div className="bg-muted p-6 rounded-lg mt-4 space-y-2">
                            <p>
                                <strong>Dinas Kependudukan dan Pencatatan Sipil Kota Tegal</strong>
                            </p>
                            <p>
                                Jl. Lele No.14, Tegalsari, Kec. Tegal Bar., Kota Tegal, Jawa Tengah 52111
                            </p>
                            <p>
                                Email: <a href="mailto:info@disdukcapiltegal.org" className="text-primary hover:underline">info@disdukcapiltegal.org</a>
                            </p>
                            <p>
                                Telepon: <a href="tel:0283343262" className="text-primary hover:underline">0283343262</a>
                            </p>
                            <p>
                                Jam Operasional: Senin - Jumat, 08:00 - 16:00 WIB
                            </p>
                        </div>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">12. Persetujuan Anda</h2>
                        <p>
                            Dengan menggunakan Sistem SiJempol Humanis, Anda menyetujui Kebijakan Privasi ini dan persetujuan pemrosesan data pribadi Anda sesuai dengan ketentuan yang tercantum di dalamnya.
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t">
                    <div className="flex gap-4 flex-wrap">
                        <Link href="/terms" className="text-primary hover:underline">
                            Syarat & Ketentuan
                        </Link>
                        <Link href="/" className="text-primary hover:underline">
                            Kembali ke Beranda
                        </Link>
                        <Link href="/hubungi-kami" className="text-primary hover:underline">
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} SiJempol Humanis - Dinas Kependudukan dan Pencatatan Sipil Kota Tegal</p>
            </footer>
        </div>
    )
}
