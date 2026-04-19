"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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

                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Syarat & Ketentuan</h1>
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
                        <h2 className="text-2xl font-bold mb-4">1. Penerimaan Syarat & Ketentuan</h2>
                        <p>
                            Dengan mengakses dan menggunakan Sistem SiJempol Humanis (selanjutnya disebut "Sistem") yang dikelola oleh Dinas Kependudukan dan Pencatatan Sipil Kota Tegal, Anda menyetujui untuk terikat oleh Syarat & Ketentuan ini, Kebijakan Privasi, dan semua peraturan yang berlaku. Jika Anda tidak setuju dengan salah satu bagian dari syarat ini, Anda tidak berhak menggunakan Sistem.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. Penggunaan Sistem</h2>
                        <p>Anda berjanji untuk menggunakan Sistem dengan cara yang sah dan tidak merugikan. Secara khusus, Anda setuju untuk tidak:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Menggunakan Sistem untuk tujuan yang melanggar hukum atau peraturan yang berlaku</li>
                            <li>Memberikan informasi palsu, menyesatkan, atau tidak akurat</li>
                            <li>Mengakses atau mencoba mengakses area Sistem yang tidak diizinkan</li>
                            <li>Mengganggu atau menginterupsi operasi normal Sistem</li>
                            <li>Melakukan aktivitas hacking, cracking, atau pembobolan keamanan</li>
                            <li>Menyebarluaskan virus, malware, atau program berbahaya lainnya</li>
                            <li>Mengumpulkan atau melacak informasi pribadi orang lain tanpa izin</li>
                            <li>Mengirimkan email spam atau komunikasi yang tidak diinginkan</li>
                            <li>Membuat akun palsu atau menggunakan akun orang lain</li>
                            <li>Melakukan aktivitas yang dapat membahayakan reputasi atau operasional Disdukcapil</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. Akun Pengguna</h2>
                        <p>
                            Jika Sistem memerlukan pembuatan akun, Anda bertanggung jawab untuk menjaga kerahasiaan informasi login Anda dan kata sandi Anda. Anda setuju untuk:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Memberikan informasi akun yang akurat dan terkini</li>
                            <li>Tidak membagikan akun atau kata sandi dengan orang lain</li>
                            <li>Segera memberitahu kami jika ada penggunaan akun yang tidak sah</li>
                            <li>Bertanggung jawab atas semua aktivitas yang dilakukan melalui akun Anda</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. Permohonan Layanan Kependudukan</h2>
                        <p>
                            Dengan mengajukan permohonan layanan melalui Sistem, Anda:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Memastikan bahwa semua informasi yang disediakan adalah akurat dan lengkap</li>
                            <li>Memiliki hak dan kewenangan untuk melakukan permohonan tersebut</li>
                            <li>Setuju untuk memberikan dokumen pendukung yang diperlukan</li>
                            <li>Memahami bahwa permohonan dapat ditolak jika tidak memenuhi persyaratan</li>
                            <li>Bersedia menghadiri verifikasi atau wawancara jika diperlukan</li>
                            <li>Membayar biaya administratif sesuai dengan peraturan yang berlaku (jika ada)</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. Verifikasi dan Validasi Data</h2>
                        <p>
                            Disdukcapil berhak untuk:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Melakukan verifikasi silang data yang Anda berikan dengan basis data pemerintah</li>
                            <li>Meminta dokumen tambahan atau klarifikasi jika diperlukan</li>
                            <li>Menolak permohonan jika data tidak dapat diverifikasi</li>
                            <li>Menangguhkan pemrosesan sampai semua dokumen lengkap</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">6. Jadwal Layanan Keliling</h2>
                        <p>
                            Informasi tentang jadwal layanan keliling disediakan sebagaimana adanya. Kami tidak menjamin bahwa jadwal tidak akan berubah. Disdukcapil berhak untuk:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Mengubah atau membatalkan jadwal layanan dengan pemberitahuan sebelumnya</li>
                            <li>Menambah atau mengurangi lokasi layanan sesuai kebutuhan</li>
                            <li>Menyesuaikan jam operasional layanan</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">7. Hak Kekayaan Intelektual</h2>
                        <p>
                            Semua konten, desain, logo, dan materi lainnya di Sistem adalah hak milik atau lisensi Disdukcapil Kota Tegal. Anda tidak boleh:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Menyalin, memodifikasi, atau mendistribusikan materi tanpa izin</li>
                            <li>Menggunakan materi untuk tujuan komersial tanpa izin tertulis</li>
                            <li>Menghilangkan pemberitahuan hak cipta atau atribusi</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">8. Pembatasan Liabilitas</h2>
                        <p>
                            Dalam batas maksimal yang diizinkan oleh hukum, Disdukcapil Kota Tegal tidak bertanggung jawab atas:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial dari penggunaan atau ketidakmampuan menggunakan Sistem</li>
                            <li>Gangguan layanan atau ketidaktersediaan Sistem</li>
                            <li>Kehilangan data atau kerusakan akibat kesalahan teknis</li>
                            <li>Tindakan pihak ketiga atau keadaan di luar kendali kami</li>
                        </ul>
                        <p className="mt-4">
                            Sistem disediakan "sebagaimana adanya" tanpa jaminan apa pun, baik tersurat maupun tersirat.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">9. Ketersediaan Sistem</h2>
                        <p>
                            Disdukcapil berusaha untuk menjaga ketersediaan Sistem 24/7, namun tidak dapat menjamin ketersediaan tanpa gangguan. Kami dapat melakukan pemeliharaan dan pembaruan tanpa pemberitahuan sebelumnya. Selama pemeliharaan, Sistem mungkin tidak dapat diakses sementara.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">10. Aspirasi dan Keluhan</h2>
                        <p>
                            Kami menerima aspirasi, saran, dan keluhan dari pengguna Sistem. Dengan menyampaikan aspirasi atau keluhan, Anda memberikan hak kepada kami untuk:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Menggunakan informasi Anda untuk meningkatkan layanan</li>
                            <li>Menampilkan aspirasi (tanpa mengungkapkan identitas pribadi) untuk keperluan internal</li>
                            <li>Memberikan respons melalui berbagai saluran komunikasi</li>
                        </ul>
                    </section>

                    {/* Section 11 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">11. Perubahan Syarat & Ketentuan</h2>
                        <p>
                            Disdukcapil berhak untuk mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di Sistem. Penggunaan berkelanjutan terhadap Sistem setelah perubahan menunjukkan penerimaan Anda terhadap perubahan tersebut.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">12. Pemutusan Akses</h2>
                        <p>
                            Disdukcapil berhak untuk membatasi, menangguhkan, atau menghentikan akses Anda ke Sistem jika:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Anda melanggar Syarat & Ketentuan ini</li>
                            <li>Anda menggunakan Sistem untuk aktivitas yang melanggar hukum</li>
                            <li>Anda memberikan informasi yang salah atau menyesatkan</li>
                            <li>Terjadi penyalahgunaan Sistem</li>
                            <li>Anda melakukan aktivitas yang merugikan operasional Disdukcapil</li>
                        </ul>
                    </section>

                    {/* Section 13 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">13. Hukum yang Berlaku</h2>
                        <p>
                            Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia. Semua sengketa yang timbul dari atau berkaitan dengan penggunaan Sistem akan diselesaikan sesuai dengan hukum Indonesia dan yurisdiksi pengadilan di Kota Tegal.
                        </p>
                    </section>

                    {/* Section 14 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">14. Pembatasan Usia</h2>
                        <p>
                            Sistem ini ditujukan untuk pengguna yang berusia 18 tahun atau lebih, atau yang memiliki izin dari orang tua/wali jika di bawah 18 tahun. Dengan menggunakan Sistem, Anda menyatakan bahwa Anda memenuhi persyaratan usia ini.
                        </p>
                    </section>

                    {/* Section 15 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">15. Kontak untuk Pertanyaan</h2>
                        <p>
                            Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami:
                        </p>
                        <div className="bg-muted p-6 rounded-lg mt-4 space-y-2">
                            <p>
                                <strong>Dinas Kependudukan dan Pencatatan Sipil Kota Tegal</strong>
                            </p>
                            <p>
                                Jl. Lele No.14, Tegalsari, Kec. Tegal Bar., Kota Tegal, Jawa Tengah 52111
                            </p>
                            <p>
                                Email: <a href="info@disdukcapiltegal.org" className="text-primary hover:underline">info@disdukcapiltegal.org</a>
                            </p>
                            <p>
                                Telepon: <a href="0283343262" className="text-primary hover:underline">0283343262</a>
                            </p>
                            <p>
                                Jam Operasional: Senin - Jumat, 08:00 - 16:00 WIB
                            </p>
                        </div>
                    </section>

                    {/* Section 16 */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">16. Persetujuan Akhir</h2>
                        <p>
                            Dengan menggunakan Sistem SiJempol Humanis, Anda menyatakan bahwa Anda telah membaca, memahami, dan setuju untuk terikat oleh semua Syarat & Ketentuan yang tersebut di atas. Jika ada bagian yang tidak Anda setujui, Anda harus segera menghentikan penggunaan Sistem.
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t">
                    <div className="flex gap-4 flex-wrap">
                        <Link href="/privacy" className="text-primary hover:underline">
                            Kebijakan Privasi
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
