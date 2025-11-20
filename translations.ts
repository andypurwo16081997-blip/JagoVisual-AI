
type Translations = {
  [key: string]: { en: string; id: string } | Translations;
};

export const translations: Translations = {
  header: {
    subtitle: { en: "AI Product Photography", id: "Fotografi Produk AI" },
    about: { en: "About", id: "Tentang" }
  },
  footer: {
    createdBy: { en: "created by", id: "dibuat oleh" }
  },
  sidebar: {
    productStudio: { en: "Product Studio", id: "Studio Produk" },
    backgroundStudio: { en: "Background Studio", id: "Studio Latar" },
    virtualTryOn: { en: "Virtual Try-On", id: "Coba Virtual" },
    lifestylePhotoshoot: { en: "Lifestyle Photoshoot", id: "Pemotretan Lifestyle" },
    mergeProduct: { en: "Merge Product", id: "Gabungkan Produk" },
    digitalImaging: { en: "Digital Imaging", id: "Pencitraan Digital" },
    poseStudio: { en: "Pose Studio", id: "Studio Pose" },
    faceSwapStudio: { en: "Face Swap Studio", id: "Studio Tukar Wajah" },
    productCarousel: { en: "Product Carousel", id: "Karosel Produk" },
    adCreator: { en: "Ad Creator", id: "Pembuat Iklan" },
    imageEditor: { en: "Image Editor", id: "Editor Gambar" },
    motionPromptStudio: { en: "Motion Prompt Studio", id: "Studio Motion Prompt" },
    videoStudio: { en: "Video Studio", id: "Studio Video" },
    sketchDesignStudio: { en: "Sketch to Design", id: "Sketsa ke Desain" },
  },
  about: {
    title: { en: "About JagoVisual AI PRO", id: "Tentang JagoVisual AI PRO" },
    description: { en: "This application is a demonstration of the creative capabilities of Google's Gemini API for advanced image generation and editing, specifically tailored for e-commerce and marketing use cases.", id: "Aplikasi ini adalah demonstrasi kemampuan kreatif Google Gemini API untuk pembuatan dan penyuntingan gambar tingkat lanjut, yang dirancang khusus untuk kasus penggunaan e-commerce dan pemasaran." },
    techStack: { en: "Technology Stack", id: "Tumpukan Teknologi" },
    geminiModels: { en: "Gemini Models Used", id: "Model Gemini yang Digunakan" },
    geminiFlashImage: { en: "Powers all image editing, generation, and inpainting tasks.", id: "Mendukung semua tugas penyuntingan, pembuatan, dan inpainting gambar." },
    geminiFlash: { en: "Used for text-based generation tasks, like creating ad copy and motion prompts.", id: "Digunakan untuk tugas pembuatan berbasis teks, seperti membuat salinan iklan dan prompt gerak." },
    geminiVeo: { en: "Powers the image-to-video generation feature.", id: "Mendukung fitur pembuatan video dari gambar." },
    productStudio: { en: "Generates professional product photoshoots from a single product image using various themes and styles.", id: "Menghasilkan pemotretan produk profesional dari satu gambar produk menggunakan berbagai tema dan gaya." },
    virtualTryOn: { en: "Places apparel from product images onto user-provided or AI-generated models.", id: "Menempatkan pakaian dari gambar produk ke model yang disediakan pengguna atau yang dihasilkan AI." },
    lifestylePhotoshoot: { en: "Creates realistic lifestyle photoshoots by placing products with user-provided or AI-generated models in described scenes.", id: "Membuat pemotretan gaya hidup yang realistis dengan menempatkan produk bersama model yang disediakan pengguna atau dihasilkan AI dalam adegan yang dideskripsikan." },
    mergeProduct: { en: "Combines multiple separate product images into a single, cohesive studio photograph.", id: "Menggabungkan beberapa gambar produk terpisah menjadi satu foto studio yang kohesif." },
    poseStudio: { en: "Generates multiple dynamic poses from a single photo of a model, keeping the model and product consistent.", id: "Menghasilkan berbagai pose dinamis dari satu foto model, dengan menjaga konsistensi model dan produk." },
    adCreator: { en: "Designs ad posters by creatively integrating user-provided text into product images.", id: "Merancang poster iklan dengan mengintegrasikan teks yang disediakan pengguna secara kreatif ke dalam gambar produk." },
    imageEditor: { en: "Provides AI tools to resize, expand (outpaint), and modify images using a magic brush (inpaint).", id: "Menyediakan alat AI untuk mengubah ukuran, memperluas (outpaint), dan memodifikasi gambar menggunakan kuas ajaib (inpaint)." },
    motionPromptStudio: { en: "Generates creative video animation prompts from a static image, ready to be used in AI video generators.", id: "Menghasilkan prompt animasi video kreatif dari gambar statis, siap digunakan di generator video AI." },
    videoStudio: { en: "Generates short video clips from a static product image and a descriptive motion prompt.", id: "Menghasilkan klip video pendek dari gambar produk statis dan prompt gerakan deskriptif." },
    sketchDesignStudio: { en: "Transforms rough hand-drawn sketches into professional visual designs (Fashion, Architecture, Logos, etc.).", id: "Mengubah sketsa tangan kasar menjadi desain visual profesional (Fashion, Arsitektur, Logo, dll.)." },
    developedBy: { en: "Developed by", id: "Dikembangkan oleh" },
    closeButton: { en: "Close", id: "Tutup" }
  },
  sections: {
    upload: {
      title: { en: "1. Upload Your Image", id: "1. Unggah Gambar Anda" },
      subtitle: { en: "Upload a clear, well-lit photo of your product.", id: "Unggah foto produk Anda yang jelas dan terang." }
    },
    style: {
      title: { en: "2. Choose Your Style", id: "2. Pilih Gaya Anda" },
      subtitle: { en: "Select a method to enhance your product image.", id: "Pilih metode untuk menyempurnakan gambar produk Anda." }
    },
    tools: {
      title: { en: "2. Choose Your Tool", id: "2. Pilih Alat Anda" },
      subtitle: { en: "Select a tool to edit your image.", id: "Pilih alat untuk mengedit gambar Anda." },
      options: {
        title: { en: "3. Tool Options", id: "3. Opsi Alat" },
        subtitle: { en: "Adjust settings for the selected tool.", id: "Sesuaikan pengaturan untuk alat yang dipilih." }
      }
    }
  },
  uploader: {
    productLabel: { en: "Upload Product Image", id: "Unggah Gambar Produk" },
    imageLabel: { en: "Upload Image", id: "Unggah Gambar" },
    targetImageLabel: { en: "Upload Target Image", id: "Unggah Gambar Target" },
    faceImageLabel: { en: "Upload Face Image", id: "Unggah Gambar Wajah" },
    modelLabel: { en: "Upload Model Image", id: "Unggah Gambar Model" },
    referenceLabel: { en: "Upload Reference Image", id: "Unggah Gambar Referensi" },
    styleReferenceLabel: { en: "Upload Style Reference", id: "Unggah Referensi Gaya" },
    sketchLabel: { en: "Upload Sketch", id: "Unggah Sketsa" },
    logoLabel: { en: "Upload Logo", id: "Unggah Logo" },
    fileTypes: { en: "PNG, JPG, GIF up to 10MB", id: "PNG, JPG, GIF hingga 10MB" }
  },
  options: {
    smart: {
      title: { en: "Smart Enhance", id: "Peningkatan Cerdas" },
      description: { en: "Let our AI automatically create the best scene for your product.", id: "Biarkan AI kami secara otomatis membuat adegan terbaik untuk produk Anda." }
    },
    customize: {
      theme: {
        label: { en: "Theme", id: "Tema" },
        other: { en: "Other...", id: "Lainnya..." }
      },
      customTheme: {
        label: { en: "Custom Theme", id: "Tema Kustom" },
        placeholder: { en: "e.g., 'Cyberpunk city street at night'", id: "cth., 'Jalan kota Cyberpunk di malam hari'" }
      },
      props: {
        label: { en: "Props / Elements (Optional)", id: "Properti / Elemen (Opsional)" },
        placeholder: { en: "e.g., 'with green leaves and water droplets'", id: "cth., 'dengan daun hijau dan tetesan air'" }
      }
    },
    reference: {
      description: { en: "Upload an image for the AI to reference its style, lighting, and mood.", id: "Unggah gambar agar AI merujuk gaya, pencahayaan, dan suasananya." }
    },
    shared: {
      instructions: {
        label: { en: "Additional Instructions (Optional)", id: "Instruksi Tambahan (Opsional)" },
        placeholderCustomize: { en: "e.g., 'Focus on a top-down angle'", id: "cth., 'Fokus pada sudut dari atas ke bawah'" },
        placeholderReference: { en: "e.g., 'Match the warm lighting'", id: "cth., 'Sesuaikan dengan pencahayaan hangat'" }
      }
    },
    enhanceButton: { en: "Enhance Image", id: "Sempurnakan Gambar" }
  },
  results: {
    title: { en: "3. Your Results", id: "3. Hasil Anda" },
    titleEditor: { en: "4. Your Results", id: "4. Hasil Anda" },
    description: { en: "Your enhanced images are ready.", id: "Gambar Anda yang telah disempurnakan sudah siap." },
    descriptionEditor: { en: "Your edited images are ready.", id: "Gambar Anda yang telah diedit sudah siap." },
    loading: {
      title: { en: "Enhancing your image...", id: "Menyempurnakan gambar Anda..." },
      titleEditor: { en: "Editing your image...", id: "Mengedit gambar Anda..." },
      subtitle: { en: "This may take a moment. Great things are coming!", id: "Ini mungkin memakan waktu sejenak. Hal-hal hebat akan datang!" }
    },
    error: {
      title: { en: "An Error Occurred", id: "Terjadi Kesalahan" },
      button: { en: "Try Again", id: "Coba Lagi" }
    },
    placeholder: { en: "Your generated images will appear here.", id: "Gambar yang Anda hasilkan akan muncul di sini." },
    imageAlt: { en: "Enhanced product shot", id: "Foto produk yang disempurnakan" },
    variantLabel: { en: "Variant", id: "Varian" },
    downloadButton: { en: "Download Image", id: "Unduh Gambar" },
    resetButton: { en: "Start Over", id: "Mulai dari Awal" }
  },
  errors: {
    noProductImage: { en: "Please upload a product image first.", id: "Harap unggah gambar produk terlebih dahulu." },
    noImage: { en: "Please upload an image first.", id: "Harap unggah gambar terlebih dahulu." },
    noReferenceImage: { en: "Please upload a reference image to use this method.", id: "Harap unggah gambar referensi untuk menggunakan metode ini." }
  },
  notes: {
    navigationWarning: { en: "Generating content can take time. Please do not navigate away from this page.", id: "Pembuatan konten dapat memakan waktu. Harap jangan tinggalkan halaman ini." },
    staticWarning: { en: "The displayed result is a static image/video. Interactive elements are not functional.", id: "Hasil yang ditampilkan adalah gambar/video statis. Elemen interaktif tidak berfungsi." }
  },
  themes: {
    cleanStudio: { en: "Clean Studio (White Background)", id: "Studio Bersih (Latar Belakang Putih)" },
    dramaticMoody: { en: "Dramatic & Moody (Dark Background)", id: "Dramatis & Gelap (Latar Belakang Gelap)" },
    naturalOrganic: { en: "Natural & Organic", id: "Alami & Organik" },
    vibrantPlayful: { en: "Vibrant & Playful", id: "Ceria & Menyenangkan" },
    modernSleek: { en: "Modern & Sleek", id: "Modern & Ramping" },
    softDreamy: { en: "Soft & Dreamy", id: "Lembut & Melamun" },
    industrialRugged: { en: "Industrial & Rugged", id: "Industri & Kasar" },
    vintageNostalgic: { en: "Vintage & Nostalgic", id: "Vintage & Nostalgia" },
    luxeElegant: { en: "Luxe & Elegant", id: "Mewah & Elegan" },
    minimalistZen: { en: "Minimalist Zen", id: "Zen Minimalis" },
    cosmicFuturistic: { en: "Cosmic & Futuristic", id: "Kosmik & Futuristik" },
    cozyRustic: { en: "Cozy & Rustic", id: "Nyaman & Rustic" },
    tropicalParadise: { en: "Tropical Paradise", id: "Surga Tropis" },
    aquaticFreshness: { en: "Aquatic Freshness", id: "Kesegaran Air" },
    urbanStreet: { en: "Urban Street Style", id: "Gaya Jalanan Perkotaan" },
    holidayCheer: { en: "Holiday Cheer", id: "Keceriaan Liburan" },
  },
  languages: {
    english: { en: "English", id: "Inggris" },
    indonesian: { en: "Indonesian", id: "Indonesia" }
  },
  productStudio: {
    page: {
      title: { en: "Product Studio", id: "Studio Produk" },
      description: { en: "Turn simple product photos into high-quality, professional-looking studio shots. Choose an intelligent enhancement or customize the scene to your liking.", id: "Ubah foto produk sederhana menjadi gambar studio berkualitas tinggi dan terlihat profesional. Pilih penyempurnaan cerdas atau sesuaikan adegan sesuai keinginan Anda." }
    }
  },
  sketchDesignStudio: {
    page: {
      title: { en: "Sketch Design Studio", id: "Studio Desain Sketsa" },
      description: { en: "Turn rough sketches on paper into professional visual designs (Fashion, Logo, Interior, etc.).", id: "Ubah sketsa kasar di kertas menjadi desain visual profesional (Fashion, Logo, Interior, dll.)." }
    },
    sections: {
      upload: {
        title: { en: "1. Upload Sketch", id: "1. Unggah Sketsa" },
        subtitle: { en: "Upload a clear photo of your hand-drawn sketch.", id: "Unggah foto sketsa tangan Anda yang jelas." }
      },
      details: {
        title: { en: "2. Design Details", id: "2. Detail Desain" },
        subtitle: { en: "Choose a category and describe the desired output.", id: "Pilih kategori dan jelaskan hasil yang diinginkan." }
      }
    },
    editor: {
      title: { en: "Refine Design", id: "Sempurnakan Desain" },
      description: { en: "Use the Magic Brush to edit specific parts of the generated design.", id: "Gunakan Kuas Ajaib untuk mengedit bagian tertentu dari desain yang dihasilkan." }
    },
    modes: {
      smart: {
        title: { en: "Smart Mode", id: "Mode Cerdas" },
        description: { en: "Let AI automatically generate a high-quality design.", id: "Biarkan AI secara otomatis menghasilkan desain berkualitas tinggi." }
      },
      customize: {
        title: { en: "Customize", id: "Kustomisasi" }
      },
      reference: {
        title: { en: "Reference", id: "Referensi" },
        description: { en: "Upload a reference image (e.g., fabric texture, color palette) to guide the design.", id: "Unggah gambar referensi (mis., tekstur kain, palet warna) untuk memandu desain." }
      }
    },
    form: {
      category: {
        label: { en: "Category", id: "Kategori" }
      },
      prompt: {
        label: { en: "Design Prompt", id: "Prompt Desain" },
        placeholder: { en: "e.g., 'A modern minimalist living room with beige tones and soft lighting'", id: "cth., 'Ruang tamu minimalis modern dengan nada krem dan pencahayaan lembut'" }
      },
      fashionPattern: {
        label: { en: "Fabric Pattern/Motif", id: "Motif/Pola Kain" },
        placeholder: { en: "e.g., 'Red floral batik pattern', 'Blue plaid'", id: "cth., 'Pola batik bunga merah', 'Kotak-kotak biru'" }
      },
      fashionPlacement: {
        label: { en: "Pattern Placement", id: "Penempatan Motif" }
      }
    },
    generateButton: { en: "✨ Generate Design", id: "✨ Buat Desain" },
    editButton: { en: "Edit & Refine", id: "Edit & Sempurnakan" },
    generateEditButton: { en: "✨ Generate Edit", id: "✨ Buat Editan" },
    categories: {
      FASHION: { en: "Fashion Design", id: "Desain Fashion" },
      LOGO: { en: "Logo & Branding", id: "Logo & Branding" },
      FURNITURE: { en: "Furniture Design", id: "Desain Furnitur" },
      INTERIOR: { en: "Interior Design", id: "Desain Interior" },
      ARCHITECTURE: { en: "Architecture", id: "Arsitektur" },
      ART: { en: "Digital Art", id: "Seni Digital" }
    },
    fashionPlacements: {
      ALL: { en: "Full Outfit / All", id: "Seluruh Pakaian / Semua" },
      TOP: { en: "Top / Shirt / Jacket", id: "Atasan / Kemeja / Jaket" },
      BOTTOM: { en: "Bottom / Skirt / Pants", id: "Bawahan / Rok / Celana" },
      DRESS: { en: "Main Dress Body", id: "Bagian Utama Gaun" },
      ACCESSORIES: { en: "Accessories (Bag/Shoes)", id: "Aksesoris (Tas/Sepatu)" }
    },
    errors: {
      noImage: { en: "Please upload a sketch image.", id: "Harap unggah gambar sketsa." },
      noPrompt: { en: "Please enter a design prompt.", id: "Harap masukkan prompt desain." },
      noReference: { en: "Please upload a reference image.", id: "Harap unggah gambar referensi." }
    }
  },
  backgroundStudio: {
    page: {
      title: { en: "Background Studio", id: "Studio Latar" },
      description: { en: "Easily remove the background to create a transparent PNG, or replace it with a new AI-generated scene.", id: "Hapus latar belakang dengan mudah untuk membuat PNG transparan, atau ganti dengan adegan baru yang dihasilkan AI." }
    },
    sections: {
      chooseTool: {
        title: { en: "2. Choose a Tool", id: "2. Pilih Alat" },
        subtitle: { en: "Remove the background or replace it with something new.", id: "Hapus latar belakang atau ganti dengan yang baru." }
      }
    },
    tools: {
      remove: {
        title: { en: "Remove", id: "Hapus" },
        description: { en: "Click the button below to remove the background. The result will be a downloadable PNG with a transparent background.", id: "Klik tombol di bawah untuk menghapus latar belakang. Hasilnya akan berupa PNG yang dapat diunduh dengan latar belakang transparan." }
      },
      replace: {
        title: { en: "Replace", id: "Ganti" },
        description: { en: "Describe the new background you want to generate for your product.", id: "Jelaskan latar belakang baru yang ingin Anda hasilkan untuk produk Anda." },
        placeholder: { en: "e.g., 'on a marble podium with soft morning light', 'on a beach with waves in the background'", id: "cth., 'di atas podium marmer dengan cahaya pagi yang lembut', 'di pantai dengan ombak di latar belakang'" }
      }
    },
    generateButton: {
      remove: { en: "✨ Remove Background", id: "✨ Hapus Latar Belakang" },
      replace: { en: "✨ Replace Background", id: "✨ Ganti Latar Belakang" }
    },
    results: {
      transparent: { en: "Transparent Background", id: "Latar Belakang Transparan" },
      description: { en: "Your product with a transparent background is ready.", id: "Produk Anda dengan latar belakang transparan sudah siap." }
    }
  },
  virtualTryOn: {
    page: {
        title: { en: "Virtual Try-On", id: "Coba Pakaian Virtual" },
        description: { en: "Place apparel from product images onto a user-provided or AI-generated model to see how it looks.", id: "Letakkan pakaian dari gambar produk ke model yang disediakan pengguna atau yang dihasilkan AI untuk melihat tampilannya." }
    },
    sections: {
        uploadProduct: {
            title: { en: "1. Upload Apparel", id: "1. Unggah Pakaian" },
            subtitle: { en: "Add up to 4 apparel images.", id: "Tambahkan hingga 4 gambar pakaian." },
            addProduct: { en: "Add Apparel", id: "Tambah Pakaian" }
        },
        provideModel: {
            title: { en: "2. Provide a Model", id: "2. Sediakan Model" },
            subtitle: { en: "Upload your model's photo or generate one with AI.", id: "Unggah foto model Anda atau hasilkan satu dengan AI." }
        }
    },
    modelOptions: {
        upload: { en: "Upload", id: "Unggah" },
        generate: { en: "Generate", id: "Hasilkan" },
        gender: { en: "Gender", id: "Jenis Kelamin" },
        female: { en: "Female", id: "Wanita" },
        male: { en: "Male", id: "Pria" },
        other: { en: "Other", id: "Lainnya" },
        ethnicity: { en: "Ethnicity", id: "Etnisitas" },
        ethnicities: {
            caucasian: { en: "Caucasian", id: "Kaukasia" },
            asian: { en: "Asian", id: "Asia" },
            african: { en: "African", id: "Afrika" },
            hispanic: { en: "Hispanic", id: "Hispanik" },
            middleEastern: { en: "Middle Eastern", id: "Timur Tengah" },
            other: { en: "Other...", id: "Lainnya..." }
        },
        customEthnicity: {
          label: { en: "Custom Ethnicity", id: "Etnisitas Kustom" },
          placeholder: { en: "e.g., 'Polynesian', 'Native American'", id: "cth., 'Polinesia', 'Pribumi Amerika'" }
        },
        details: { en: "Additional Details (Pose, Background, etc.)", id: "Detail Tambahan (Pose, Latar, dll.)" },
        detailsPlaceholder: { en: "e.g., 'standing confidently, grey studio background, wearing blue jeans'", id: "cth., 'berdiri percaya diri, latar belakang studio abu-abu, mengenakan jeans biru'" }
    },
    generateButton: { en: "✨ Virtually Try On", id: "✨ Coba Pakaian" },
    errors: {
        noProducts: { en: "Please upload at least one apparel image.", id: "Harap unggah setidaknya satu gambar pakaian." },
        noModel: { en: "Please upload a model image or choose to generate one.", id: "Harap unggah gambar model atau pilih untuk menghasilkan satu." }
    }
  },
  lifestylePhotoshoot: {
    page: {
        title: { en: "Lifestyle Photoshoot", id: "Pemotretan Gaya Hidup" },
        description: { en: "Create realistic lifestyle photos by placing your product with a model in a scene you describe.", id: "Buat pemotretan gaya hidup yang realistis dengan menempatkan produk bersama model di adegan yang Anda deskripsikan." }
    },
    sections: {
        uploadProduct: {
            title: { en: "1. Upload Product", id: "1. Unggah Produk" },
            subtitle: { en: "Upload a single image of the product to feature.", id: "Unggah satu gambar produk untuk ditampilkan." }
        },
        provideModel: {
            title: { en: "2. Provide a Model", id: "2. Sediakan Model" },
            subtitle: { en: "Upload your model's photo or generate one with AI.", id: "Unggah foto model Anda atau hasilkan satu dengan AI." }
        },
        direct: {
            title: { en: "3. Direct the Photoshoot", id: "3. Atur Arah Pemotretan" },
            subtitle: { en: "Describe the scene, background, and interaction.", id: "Jelaskan adegan, latar belakang, dan interaksi." }
        }
    },
    form: {
        interaction: {
            label: { en: "Scene & Interaction Description", id: "Deskripsi Adegan & Interaksi" },
            placeholder: { en: "e.g., 'A model is smiling while holding the product in a bright cafe with plants in the background.'", id: "cth., 'Seorang model sedang tersenyum sambil memegang produk di sebuah kafe yang cerah dengan tanaman di latar belakang.'" }
        }
    },
    generateButton: { en: "✨ Generate Photoshoot", id: "✨ Buat Foto" },
    errors: {
        noProduct: { en: "Please upload a product image.", id: "Harap unggah gambar produk." },
        noModel: { en: "Please upload a model image or choose to generate one.", id: "Harap unggah gambar model atau pilih untuk menghasilkan satu." }
    }
  },
  adCreator: {
    page: {
        title: { en: "Ad Creator", id: "Pembuat Iklan" },
        description: { en: "Design compelling ad posters by creatively integrating your text onto product images.", id: "Rancang poster iklan yang menarik dengan mengintegrasikan teks yang Anda berikan secara kreatif ke dalam gambar produk." }
    },
    sections: {
        addCopy: {
            title: { en: "2. Add Ad Copy", id: "2. Tambahkan Teks Iklan" },
            subtitle: { en: "Write your own copy or use the AI Copywriter.", id: "Tulis teks Anda atau gunakan AI Copywriter." }
        }
    },
    form: {
        headline: {
            label: { en: "Headline", id: "Judul (Headline)" },
            placeholder: { en: "e.g., 'New Collection Arrived'", id: "cth., 'Koleksi Terbaru Telah Tiba'" }
        },
        description: {
            label: { en: "Description (Optional)", id: "Deskripsi (Opsional)" },
            placeholder: { en: "e.g., 'Find your perfect style this season.'", id: "cth., 'Temukan gaya sempurna Anda musim ini.'" }
        },
        cta: {
            label: { en: "Call to Action (Optional)", id: "Panggilan Aksi / CTA (Opsional)" },
            placeholder: { en: "e.g., 'Shop Now', '50% Off'", id: "cth., 'Beli Sekarang', 'Diskon 50%'" }
        },
        reference: {
            label: { en: "Style Reference (Optional)", id: "Referensi Gaya (Opsional)" },
            description: { en: "Upload an image for the AI to reference its visual style.", id: "Unggah gambar untuk AI merujuk gaya visualnya." }
        },
        instructions: {
            label: { en: "Additional Instructions (Optional)", id: "Instruksi Tambahan (Opsional)" },
            placeholder: { en: "e.g., 'use an elegant font, place text in the bottom right'", id: "cth., 'gunakan font elegan, tempatkan teks di sudut kanan bawah'" }
        }
    },
    generateButton: { en: "✨ Create Ad", id: "✨ Buat Iklan" },
    errors: {
        noProductImage: { en: "Please upload a product image first.", id: "Harap unggah gambar produk terlebih dahulu." },
        noHeadline: { en: "Please enter a headline.", id: "Harap masukkan judul (headline)." }
    },
    copywriter: {
        button: { en: "AI Copywriter", id: "AI Copywriter" },
        modalTitle: { en: "AI Copywriter", id: "AI Copywriter" },
        productNameLabel: { en: "Product Name", id: "Nama Produk" },
        productNamePlaceholder: { en: "e.g., 'HydraGlow Face Serum'", id: "cth., 'Serum Wajah HydraGlow'" },
        keywordsLabel: { en: "Keywords (Optional)", id: "Kata Kunci (Opsional)" },
        keywordsPlaceholder: { en: "e.g., 'hydrating, anti-aging, glowing'", id: "cth., 'melembapkan, anti-penuaan, cerah'" },
        generateButton: { en: "Generate Copy", id: "Hasilkan Teks" },
        loading: { en: "Generating ideas...", id: "Menghasilkan ide..." },
        error: { en: "Failed to generate suggestions. Please try again.", id: "Gagal menghasilkan saran. Silakan coba lagi." },
        suggestionsFor: {
            headline: { en: "Headline Suggestions", id: "Saran Judul" },
            description: { en: "Description Suggestions", id: "Saran Deskripsi" },
            cta: { en: "CTA Suggestions", id: "Saran Panggilan Aksi" }
        },
        useButton: { en: "Use", id: "Gunakan" }
    }
  },
  poseStudio: {
    page: {
        title: { en: "Pose Studio", id: "Studio Pose" },
        description: { en: "Generate multiple dynamic poses from a single photo of a model. The AI keeps the model, apparel, and product consistent.", id: "Hasilkan berbagai pose dinamis dari satu foto model. AI akan menjaga konsistensi model, pakaian, dan produk." }
    },
    sections: {
        uploadModel: {
            title: { en: "1. Upload Model Image", id: "1. Unggah Gambar Model" },
            subtitle: { en: "Upload a clear photo of your model with the product.", id: "Unggah foto model yang jelas dengan produk." }
        },
        chooseStyle: {
            title: { en: "2. Choose Pose Style", id: "2. Pilih Gaya Pose" },
            subtitle: { en: "Use Smart mode or customize the direction.", id: "Pilih mode Cerdas atau sesuaikan arahannya." }
        }
    },
    modes: {
        smart: {
            title: { en: "Smart", id: "Cerdas" },
            description: { en: "Let the AI automatically create 3 varied and appealing poses.", id: "Biarkan AI secara otomatis membuat 3 pose yang bervariasi dan menarik." }
        },
        customize: {
            title: { en: "Customize", id: "Kustom" }
        }
    },
    form: {
        theme: {
            label: { en: "Background Theme", id: "Tema Latar Belakang" }
        },
        angle: {
            label: { en: "Shot Angle", id: "Sudut Pengambilan" }
        },
        framing: {
            label: { en: "Framing", id: "Pembingkaian (Framing)" }
        },
        depthOfField: {
            label: { en: "Depth of Field", id: "Kedalaman Bidang" }
        },
        lighting: {
            label: { en: "Lighting Style", id: "Gaya Pencahayaan" }
        },
        instructions: {
            label: { en: "Additional Instructions (Optional)", id: "Instruksi Tambahan (Opsional)" },
            placeholder: { en: "e.g., 'more energetic poses', 'happy expression'", id: "cth., 'pose yang lebih energik', 'ekspresi bahagia'" }
        }
    },
    angles: {
        eyeLevel: { en: "Eye Level", id: "Sejajar Mata" },
        highAngle: { en: "High Angle", id: "Sudut Tinggi" },
        lowAngle: { en: "Low Angle", id: "Sudut Rendah" },
        dutchAngle: { en: "Dutch Angle", id: "Sudut Miring" },
        wormsEyeView: { en: "Worm's Eye View", id: "Sudut Pandang Cacing" }
    },
    frames: {
        fullBody: { en: "Full Body", id: "Seluruh Badan" },
        mediumShot: { en: "Medium Shot", id: "Setengah Badan" },
        cowboyShot: { en: "Cowboy Shot", id: "Tiga Perempat Badan" },
        closeup: { en: "Close-up", id: "Close-up" }
    },
    dof: {
        shallow: { en: "Shallow (blurry background)", id: "Dangkal (latar belakang buram)" },
        medium: { en: "Medium", id: "Sedang" },
        deep: { en: "Deep (sharp background)", id: "Dalam (latar belakang tajam)" }
    },
    lighting: {
        softbox: { en: "Studio Softbox", id: "Softbox Studio" },
        rim: { en: "Dramatic Rim Lighting", id: "Pencahayaan Tepi Dramatis" },
        goldenHour: { en: "Golden Hour Sunlight", id: "Cahaya Matahari Senja" },
        neon: { en: "Neon Noir", id: "Neon Gelap" }
    },
    generateButton: { en: "✨ Generate Poses", id: "✨ Hasilkan Pose" },
    errors: {
        noModelImage: { en: "Please upload a model image first.", id: "Harap unggah gambar model terlebih dahulu." }
    }
  },
  imageEditor: {
    page: {
        title: { en: "Image Editor", id: "Editor Gambar" },
        description: { en: "Use AI tools to resize, expand (outpaint), or modify parts of an image with a magic brush (inpaint).", id: "Gunakan alat AI untuk mengubah ukuran, memperluas (outpainting), atau memodifikasi gambar dengan kuas ajaib (inpainting)." }
    },
    tools: {
        resize: {
            title: { en: "Resize / Expand", id: "Ubah Ukuran / Perluas" },
            description: { en: "Select a new aspect ratio to intelligently expand your image.", id: "Pilih rasio aspek baru untuk memperluas gambar Anda secara cerdas." },
            label: { en: "New Aspect Ratio", id: "Rasio Aspek Baru" },
            ar_1_1: { en: "1:1", id: "1:1" },
            ar_4_3: { en: "4:3", id: "4:3" },
            ar_3_4: { en: "3:4", id: "3:4" },
            ar_16_9: { en: "16:9", id: "16:9" },
            ar_9_16: { en: "9:16", id: "9:16" },
            ar_3_2: { en: "3:2", id: "3:2" },
            ar_2_3: { en: "2:3", id: "2:3" }
        },
        magicBrush: {
            title: { en: "Magic Brush", id: "Kuas Ajaib" },
            description: { en: "Paint over an area you want to change, then type your instruction.", id: "Sapukan kuas pada area yang ingin diubah, lalu tulis perintah Anda." },
            promptLabel: { en: "What do you want to change/add?", id: "Apa yang ingin Anda ubah/tambahkan?" },
            promptPlaceholder: { en: "e.g., 'change the color to blue', 'add a butterfly'", id: "cth., 'ganti warna menjadi biru', 'tambahkan seekor kupu-kupu'" },
            brushSize: { en: "Brush Size", id: "Ukuran Kuas" },
            undo: { en: "Undo", id: "Urungkan" },
            clear: { en: "Clear", id: "Hapus" }
        }
    },
    generateButton: { en: "✨ Process Image", id: "✨ Proses Gambar" },
    errors: {
        noMask: { en: "Please mark an area on the image with the brush first.", id: "Harap tandai area pada gambar dengan kuas terlebih dahulu." },
        noPrompt: { en: "Please enter a prompt for the magic brush.", id: "Harap masukkan perintah untuk kuas ajaib." }
    }
  },
  motionPromptStudio: {
    page: {
      title: { en: "Motion Prompt Studio", id: "Studio Motion Prompt" },
      description: { en: "Generate creative video prompts from a static image. These prompts are ready for AI video generators like Veo.", id: "Hasilkan prompt video kreatif dari gambar statis. Prompt ini siap digunakan di generator video AI seperti Veo." }
    },
    sections: {
      upload: {
        title: { en: "1. Upload Image", id: "1. Unggah Gambar" },
        subtitle: { en: "Choose the image you want to animate.", id: "Pilih gambar yang ingin Anda animasikan." }
      },
      keywords: {
        title: { en: "2. Add Keywords (Optional)", id: "2. Tambahkan Kata Kunci (Opsional)" },
        subtitle: { en: "Provide keywords to guide the prompt generation.", id: "Berikan kata kunci untuk memandu pembuatan prompt." }
      }
    },
    form: {
      placeholder: { en: "e.g., 'cinematic, dramatic, dusk light'", id: "cth., 'sinematik, dramatis, cahaya senja'" }
    },
    generateButton: { en: "✨ Generate Prompts", id: "✨ Hasilkan Prompt" },
    loading: {
      title: { en: "Brewing up creative ideas...", id: "Mencari ide-ide kreatif..." }
    },
    results: {
      title: { en: "3. Generated Prompts", id: "3. Prompt yang Dihasilkan" },
      description: { en: "Copy these prompts and use them in the Video Studio or other AI generators.", id: "Salin prompt ini dan gunakan di Studio Video atau generator AI lainnya." },
      copyButton: { en: "Copy Prompt", id: "Salin Prompt" },
      copied: { en: "Copied!", id: "Tersalin!" },
      regenerateButton: { en: "Regenerate", id: "Hasilkan Ulang" },
      placeholder: { en: "Your generated prompts will appear here.", id: "Prompt yang Anda hasilkan akan muncul di sini." }
    },
    errors: {
      noImage: { en: "Please upload an image first.", id: "Harap unggah gambar terlebih dahulu." }
    }
  },
  videoStudio: {
    page: {
      title: { en: "Video Studio", id: "Studio Video" },
      description: { en: "Generate short video clips from a static image and a descriptive motion prompt. Powered by Veo.", id: "Hasilkan klip video pendek dari gambar statis dan prompt gerakan yang deskriptif. Didukung oleh Veo." }
    },
    quotaWarning: { en: "This feature uses your Google Cloud Project quota. Generated videos are approx. 4 seconds long.", id: "Fitur ini menggunakan kuota Google Cloud Project Anda. Video yang dihasilkan berdurasi sekitar 4 detik." },
    sections: {
      upload: {
        title: { en: "1. Upload Image", id: "1. Unggah Gambar" },
        subtitle: { en: "Choose the image you want to animate.", id: "Pilih gambar yang ingin Anda animasikan." }
      },
      prompt: {
        title: { en: "2. Write a Motion Prompt", id: "2. Tulis Motion Prompt" },
        subtitle: { en: "Describe the movement, camera, and mood.", id: "Jelaskan gerakan, kamera, dan suasana." }
      }
    },
    form: {
      prompt: {
        label: { en: "Motion Prompt", id: "Motion Prompt" },
        placeholder: { en: "e.g., 'slow zoom into the product, with cherry blossom petals gently falling in the background, warm and dreamy lighting.'", id: "cth., 'zoom perlahan ke produk, dengan kelopak bunga sakura berjatuhan lembut di latar belakang, pencahayaan hangat dan melamun.'" }
      },
      magicPrompt: {
        label: { en: "Magic Prompt", id: "Prompt Ajaib" },
        loading: { en: "Loading...", id: "Memuat..." }
      }
    },
    generateButton: { en: "✨ Generate Video", id: "✨ Hasilkan Video" },
    loading: {
      title: { en: "Generating your video...", id: "Menghasilkan video Anda..." },
      messages: { en: "[\"Preparing the scene...\", \"Setting the lighting...\", \"Animating the subject...\", \"Rendering the frames...\", \"Adding final touches...\"]", id: "[\"Menyiapkan adegan...\", \"Mengatur pencahayaan...\", \"Menganimasikan subjek...\", \"Merender frame...\", \"Menambahkan sentuhan akhir...\"]" }
    },
    results: {
      title: { en: "3. Your Video", id: "3. Video Anda" },
      description: { en: "Your finished video is ready.", id: "Video Anda yang telah selesai sudah siap." },
      downloadButton: { en: "Download Video", id: "Unduh Video" },
      placeholder: { en: "Your generated video will appear here.", id: "Video yang Anda hasilkan akan muncul di sini." }
    },
    errors: {
      noImage: { en: "Please upload an image first.", id: "Harap unggah gambar terlebih dahulu." },
      noPrompt: { en: "Please enter a motion prompt.", id: "Harap masukkan motion prompt." }
    }
  },
  digitalImaging: {
    page: {
      title: { en: "Digital Imaging", id: "Pencitraan Digital" },
      description: { en: "Create surreal and conceptual ad images. The AI keeps the product realistic while manipulating its environment.", id: "Buat gambar iklan yang sureal dan konseptual. AI akan menjaga produk tetap realistis sambil memanipulasi lingkungan sekitarnya." }
    },
    sections: {
      concept: {
        title: { en: "2. Choose Concept Method", id: "2. Pilih Metode Konsep" },
        subtitle: { en: "Choose to customize it yourself or let the AI generate ideas.", id: "Pilih untuk menyesuaikan sendiri atau biarkan AI menghasilkan ide." }
      },
      style: {
        title: { en: "3. Set the Style", id: "3. Atur Gaya" },
        subtitle: { en: "Choose a theme and provide creative instructions.", id: "Pilih tema dan berikan instruksi kreatif." }
      }
    },
    modes: {
      customize: { en: "Customize", id: "Kustomisasi" },
      generateConcept: { en: "Generate Concepts", id: "Hasilkan Konsep" }
    },
    generateButton: { en: "✨ Generate Image", id: "✨ Hasilkan Gambar" },
    conceptGenerator: {
      title: { en: "3. Generate Concepts", id: "3. Hasilkan Konsep" },
      subtitle: { en: "Let the AI suggest some creative ideas for your image.", id: "Biarkan AI menyarankan beberapa ide kreatif untuk gambar Anda." },
      button: { en: "Generate Concept Ideas", id: "Hasilkan Ide Konsep" },
      resultsTitle: { en: "4. Choose a Concept", id: "4. Pilih Konsep" },
      resultsSubtitle: { en: "Select your favorite concept to generate an image.", id: "Pilih konsep favorit Anda untuk dijadikan gambar." },
      loading: { en: "Generating concepts...", id: "Menghasilkan konsep..." },
      generateImageButton: { en: "Generate Image", id: "Jadikan Gambar" }
    },
    errors: {
      conceptError: { en: "Failed to generate concepts. Please try again.", id: "Gagal menghasilkan konsep. Silakan coba lagi." }
    },
    themes: {
      miniatureWorld: { en: "Miniature World", id: "Dunia Miniatur" },
      natureFusion: { en: "Nature Fusion", id: "Fusi Alam" },
      surrealFloating: { en: "Surreal Floating Objects", id: "Objek Melayang Sureal" },
      cyberneticGlow: { en: "Cybernetic Glow", id: "Cahaya Sibernetik" },
      watercolorSplash: { en: "Watercolor Splash", id: "Percikan Cat Air" },
      papercraftArt: { en: "Papercraft Artistry", id: "Seni Kerajinan Kertas" },
      galaxyInfused: { en: "Galaxy Infused", id: "Berpadu dengan Galaksi" },
      architecturalIllusion: { en: "Architectural Illusion", id: "Ilusi Arsitektural" }
    }
  },
  productCarousel: {
    page: {
      title: { en: "Product Carousel Generator", id: "Generator Karosel Produk" },
      description: { en: "Create a complete, multi-slide social media carousel post from your product images, including visuals and captions.", id: "Buat postingan karosel media sosial multi-slide lengkap dari gambar produk Anda, termasuk visual dan keterangannya." }
    },
    sections: {
      upload: {
        title: { en: "1. Upload Product Images", id: "1. Unggah Gambar Produk" },
        subtitle: { en: "Add up to 5 images of your product.", id: "Tambahkan hingga 5 gambar produk Anda." },
        addProduct: { en: "Add Product Image", id: "Tambah Gambar Produk" }
      },
      details: {
        title: { en: "2. Provide Details & Options", id: "2. Berikan Detail & Opsi" },
        subtitle: { en: "Fill in the details to generate compelling carousel content.", id: "Isi detail untuk menghasilkan konten karosel yang menarik." }
      },
      results: {
        title: { en: "3. Your Generated Carousel", id: "3. Karosel yang Dihasilkan" },
        description: { en: "Review your slides and copy the caption below.", id: "Tinjau slide Anda dan salin keterangan di bawah ini." }
      }
    },
    form: {
      productName: {
        label: { en: "Product Name", id: "Nama Produk" },
        placeholder: { en: "e.g., 'HydraGlow Serum'", id: "cth., 'Serum HydraGlow'" }
      },
      benefits: {
        label: { en: "Key Benefits / Features", id: "Manfaat / Fitur Utama" },
        placeholder: { en: "e.g., 'deep hydration, reduces wrinkles, natural ingredients'", id: "cth., 'hidrasi mendalam, mengurangi kerutan, bahan alami'" }
      },
      audience: {
        label: { en: "Target Audience", id: "Target Audiens" },
        placeholder: { en: "e.g., 'women aged 30-50 with dry skin'", id: "cth., 'wanita usia 30-50 dengan kulit kering'" }
      },
      platform: {
        label: { en: "Platform", id: "Platform" }
      },
      slideCount: {
        label: { en: "Number of Slides", id: "Jumlah Slide" }
      },
      language: {
        label: { en: "Generated Language", id: "Bahasa Hasil" }
      },
      aspectRatio: {
        label: { en: "Aspect Ratio", id: "Rasio Aspek" }
      },
      addLogo: {
        label: { en: "Add Your Logo?", id: "Tambahkan Logo Anda?" }
      }
    },
    errors: {
      no_product_image: { en: "Please upload at least one product image.", id: "Harap unggah setidaknya satu gambar produk." },
      no_product_name: { en: "Please enter a product name.", id: "Harap masukkan nama produk." }
    },
    generateButton: { en: "✨ Generate Carousel", id: "✨ Buat Karosel" },
    loading: { en: "Generating your carousel... this may take a minute.", id: "Membuat karosel Anda... ini mungkin memakan waktu sebentar." },
    results_placeholder: { en: "Your generated carousel will appear here.", id: "Karosel yang Anda hasilkan akan muncul di sini." },
    slide: { en: "Slide", id: "Slide" },
    download_slide: { en: "Download Slide", id: "Unduh Slide" },
    download_all_slides: { en: "Download All Slides", id: "Unduh Semua Slide" },
    carousel_caption: { en: "Carousel Caption", id: "Keterangan Karosel" },
    copy_caption: { en: "Copy Caption", id: "Salin Keterangan" },
    copied: { en: "Copied!", id: "Tersalin!" },
    regenerate_slide: { en: "Regenerate Image", id: "Buat Ulang Gambar" },
    regenerating: { en: "Regenerating...", id: "Membuat ulang..." },
    edit_tooltip: { en: "Edit the text and regenerate the image to see your changes.", id: "Edit teks dan buat ulang gambar untuk melihat perubahan Anda." }
  },
  mergeProduct: {
    page: {
        title: { en: "Merge Products", id: "Gabungkan Produk" },
        description: { en: "Combine multiple product images into a single, cohesive studio photograph. The AI will arrange them naturally with consistent lighting and shadows.", id: "Gabungkan beberapa gambar produk menjadi satu foto studio yang kohesif. AI akan mengaturnya secara alami dengan pencahayaan dan bayangan yang konsisten." }
    },
    sections: {
        uploadProducts: {
            title: { en: "1. Upload Product Images", id: "1. Unggah Gambar Produk" },
            subtitle: { en: "Add 2 to 4 images you want to combine.", id: "Tambahkan 2 hingga 4 gambar yang ingin Anda gabungkan." },
            addProduct: { en: "Add Product Image", id: "Tambah Gambar Produk" }
        }
    },
    errors: {
        atLeastTwo: { en: "Please upload at least two product images to merge.", id: "Harap unggah setidaknya dua gambar produk untuk digabungkan." }
    }
  },
  faceSwapStudio: {
    page: {
        title: { en: "Face Swap Studio", id: "Studio Tukar Wajah" },
        description: { en: "Swap a face from one image onto a person in another. The AI handles lighting and skin tone matching.", id: "Tukar wajah dari satu gambar ke orang di gambar lain. AI akan menangani pencocokan pencahayaan dan warna kulit." }
    },
    sections: {
        uploadTarget: {
            title: { en: "1. Upload Target Image", id: "1. Unggah Gambar Target" },
            subtitle: { en: "The main image where you want to swap a face.", id: "Gambar utama tempat Anda ingin menukar wajah." }
        },
        uploadFace: {
            title: { en: "2. Upload Face Image", id: "2. Unggah Gambar Wajah" },
            subtitle: { en: "A clear, front-facing image of the face to use.", id: "Gambar wajah yang jelas dan menghadap ke depan untuk digunakan." }
        },
        results: {
            title: { en: "3. Your Result", id: "3. Hasil Anda" },
            description: { en: "The face has been swapped. You can make further edits.", id: "Wajah telah ditukar. Anda dapat melakukan pengeditan lebih lanjut." }
        }
    },
    generateButton: { en: "✨ Swap Face", id: "✨ Tukar Wajah" },
    editButton: { en: "Edit Imperfections", id: "Perbaiki Kekurangan" },
    errors: {
        noTarget: { en: "Please upload a target image.", id: "Harap unggah gambar target." },
        noFace: { en: "Please upload an image of the face to swap.", id: "Harap unggah gambar wajah untuk ditukar." }
    }
  }
};

// Helper function to get nested translations
export function getTranslation(key: string, lang: 'en' | 'id', source: Translations): string {
  const keys = key.split('.');
  let result: any = source;
  for (const k of keys) {
    result = result[k];
    if (!result) {
      // If a key is not found, return the key itself as a fallback.
      return key;
    }
  }
  return result[lang] || key;
}