import type { LanguageCode } from '../types/cropsense';

export interface TranslationDictionary {
  brandName: string;
  languageLabel: string;
  nav: {
    solutions: string;
    plans: string;
    news: string;
    tryItFree: string;
    home: string;
    dashboard: string;
    reports: string;
    chatbot: string;
    historicalAnalysis: string;
    newAnalysis: string;
    toggleMenu: string;
  };
  home: {
    announcement: string;
    headlineLine1: string;
    headlineLine2: string;
    backedBy: string;
    videoUnavailableFallback: string;
    tryUsButton: string;
    aboutUsButton: string;
    about: {
      kicker: string;
      heading: string;
      paragraph1: string;
      paragraph2: string;
      pillar1Title: string;
      pillar1Desc: string;
      pillar2Title: string;
      pillar2Desc: string;
      pillar3Title: string;
      pillar3Desc: string;
      startCta: string;
      chatbotCta: string;
      footerTagline: string;
    };
  };
  dashboard: {
    farmDetailsTitle: string;
    farmDetailsSubtitle: string;
    locationGroup: string;
    farmInfoGroup: string;
    stateLabel: string;
    cityLabel: string;
    cityPlaceholder: string;
    latitudeLabel: string;
    latitudePlaceholder: string;
    longitudeLabel: string;
    longitudePlaceholder: string;
    optionalTag: string;
    requiredTag: string;
    locationOrCoordsHint: string;
    farmSizeLabel: string;
    farmSizePlaceholder: string;
    cropLabel: string;
    cropSearchPlaceholder: string;
    seasonLabel: string;
    yieldLabel: string;
    yieldPlaceholder: string;
    saveButton: string;
    savedSuccess: string;
    editHint: string;
    intelligenceKicker: string;
    intelligenceHeadline: string;
    intelligenceDescription: string;
    chatbotCardTitle: string;
    chatbotCardDescription: string;
    chatbotCardAction: string;
    historicalCardTitle: string;
    historicalCardDescription: string;
    historicalCardAction: string;
    validation: {
      locationOrCoordsRequired: string;
      invalidLatitude: string;
      invalidLongitude: string;
      invalidFarmSize: string;
      cropRequired: string;
      seasonRequired: string;
      invalidYield: string;
    };
  };
  options: {
    units: Record<string, string>;
    crops: Record<string, string>;
    seasons: Record<string, string>;
    severities: Record<string, string>;
    statuses: Record<string, string>;
  };
  chatbot: {
    title: string;
    subtitle: string;
    editFarmLink: string;
    welcomeMessage: string;
    inputPlaceholder: string;
    sendButton: string;
    uploadImageAria: string;
    removeImageAria: string;
    voiceStartAria: string;
    voiceStopAria: string;
    listeningLabel: string;
    speakAria: string;
    stopSpeakingAria: string;
    clearChatButton: string;
    analyzingLabel: string;
    analyzingImageLabel: string;
    imageReadyLabel: string;
    quickActionsLabel: string;
    quickActions: {
      detectDisease: string;
      checkRisk: string;
      preventiveMeasures: string;
      recommendTreatment: string;
      environmentalConditions: string;
    };
    quickActionPrompts: {
      detectDisease: string;
      checkRisk: string;
      preventiveMeasures: string;
      recommendTreatment: string;
      environmentalConditions: string;
    };
    diseaseCard: {
      diseaseIdentified: string;
      confidence: string;
      severity: string;
      riskLevel: string;
      visibleSymptoms: string;
      potentialCauses: string;
      preventiveMeasures: string;
      suggestedTreatment: string;
      whenToSeekExpert: string;
      demoNotice: string;
      saveReportButton: string;
      reportSavedButton: string;
      defaultDisclaimer: string;
    };
    voiceErrors: {
      unsupported: string;
      permissionDenied: string;
      generic: string;
      ttsUnsupported: string;
    };
    errors: {
      invalidImageType: string;
      imageTooLarge: string;
      requestFailed: string;
      demoFallbackBanner: string;
    };
  };
  historical: {
    title: string;
    subtitle: string;
    farmContextTitle: string;
    editOnDashboard: string;
    coordinatesNotSet: string;
    configTitle: string;
    yearRangeLabel: string;
    lastFiveYears: string;
    seasonLabel: string;
    parametersLabel: string;
    generateButton: string;
    generatingButton: string;
    reportQueuedMessage: string;
    parameters: {
      vegetationHealth: string;
      vegetationIndex: string;
      cropCoverage: string;
      waterAvailability: string;
      soilCondition: string;
      environmentalTrends: string;
    };
    comingSoonBannerTitle: string;
    comingSoonBannerBody: string;
    satellitePanelTitle: string;
    satelliteCompareToggle: string;
    primaryYearLabel: string;
    compareYearLabel: string;
    satelliteComingSoonTitle: string;
    satelliteComingSoonBody: string;
    satelliteProviderNote: string;
    satelliteForYear: string;
    comingSoonShort: string;
    chartsSectionTitle: string;
    chartsPreviewNotice: string;
    chartTitles: {
      vegetationHealth: string;
      seasonalIndex: string;
      environmentalTrends: string;
      cropHealthComparison: string;
      fiveYearChange: string;
    };
    chartLabels: {
      ndvi: string;
      healthScore: string;
      rainfallMm: string;
      soilMoisture: string;
      cropCoverage: string;
      avgTemp: string;
    };
  };
  reports: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterDisease: string;
    filterHistorical: string;
    searchPlaceholder: string;
    emptyTitle: string;
    emptyDescription: string;
    startAnalysisCta: string;
    goToHistoricalCta: string;
    createdOn: string;
    cropLabel: string;
    locationLabel: string;
    findingLabel: string;
    severityLabel: string;
    statusLabel: string;
    viewReport: string;
    viewRecommendations: string;
    downloadPdf: string;
    deleteReport: string;
    typeDisease: string;
    typeHistorical: string;
    modalClose: string;
    modalSummaryTitle: string;
    modalRecommendationsTitle: string;
    modalSymptomsTitle: string;
    modalCausesTitle: string;
    modalPreventiveTitle: string;
    modalExpertTitle: string;
    pdfSuccessToast: string;
  };
}

export const LANGUAGE_OPTIONS: { code: LanguageCode; nativeName: string; speechLocale: string }[] = [
  { code: 'en', nativeName: 'English', speechLocale: 'en-IN' },
  { code: 'hi', nativeName: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'mr', nativeName: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', speechLocale: 'kn-IN' },
];

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brandName: 'CropSense',
    languageLabel: 'Language',
    nav: {
      solutions: 'Solutions',
      plans: 'Plans',
      news: 'News',
      tryItFree: 'Try It Free',
      home: 'Home',
      dashboard: 'Dashboard',
      reports: 'Reports',
      chatbot: 'AI Assistant',
      historicalAnalysis: 'Historical Analysis',
      newAnalysis: 'New Analysis',
      toggleMenu: 'Toggle menu',
    },
    home: {
      announcement: 'Live for everyone today! Smarter farming starts here.',
      headlineLine1: 'Your crops deserve an earlier warning.',
      headlineLine2: 'One intelligent system to protect every harvest.',
      backedBy: 'Backed by',
      videoUnavailableFallback: 'CropSense agricultural landscape',
      tryUsButton: 'Try Us',
      aboutUsButton: 'About Us',
      about: {
        kicker: 'ABOUT US',
        heading: 'Built to give every farmer clarity before crop stress spreads.',
        paragraph1:
          'CropSense brings together AI-powered leaf disease analysis, voice-ready agronomy guidance, and historical field intelligence in one calm, easy-to-use workspace tailored for Indian agriculture.',
        paragraph2:
          'By combining your exact farm context—state, district, acreage, crop, and season—with instant visual diagnostics in English, Hindi, Marathi, and Kannada, CropSense helps growers spot early warning signs and protect yields before minor symptoms become costly losses.',
        pillar1Title: 'Early Disease Detection',
        pillar1Desc:
          'Upload or scan crop leaves for instant preliminary diagnosis, severity assessment, and practical preventive guidance.',
        pillar2Title: 'Multilingual & Voice First',
        pillar2Desc:
          'Ask questions by text or voice in English, Hindi, Marathi, and Kannada—grounded in your saved farm profile.',
        pillar3Title: '5-Year Field Intelligence',
        pillar3Desc:
          'Compare seasonal patterns, track environmental shifts, and export clean PDF reports ready for farm records.',
        startCta: 'Try CropSense Now',
        chatbotCta: 'Open AI Assistant',
        footerTagline: 'Predictive crop health intelligence for every harvest.',
      },
    },
    dashboard: {
      farmDetailsTitle: 'Farm Details',
      farmDetailsSubtitle: 'Provide your farm information for accurate analysis.',
      locationGroup: 'Location',
      farmInfoGroup: 'Farm Information',
      stateLabel: 'State',
      cityLabel: 'City / District',
      cityPlaceholder: 'Search or enter city',
      latitudeLabel: 'Latitude',
      latitudePlaceholder: 'e.g. 20.9320',
      longitudeLabel: 'Longitude',
      longitudePlaceholder: 'e.g. 77.7523',
      optionalTag: 'Optional',
      requiredTag: 'Required',
      locationOrCoordsHint: 'Enter State & City, or provide exact Latitude & Longitude.',
      farmSizeLabel: 'Farm Size',
      farmSizePlaceholder: 'Enter area',
      cropLabel: 'Crop',
      cropSearchPlaceholder: 'Select crop',
      seasonLabel: 'Season',
      yieldLabel: "Last Year's Yield Value (₹)",
      yieldPlaceholder: 'e.g. 125000',
      saveButton: 'Save Farm Details',
      savedSuccess: 'Farm details saved. AI Assistant and Historical Analysis are updated.',
      editHint: 'You can update your farm details anytime.',
      intelligenceKicker: 'FARM INTELLIGENCE',
      intelligenceHeadline: 'Your Crop Health, Powered by AI',
      intelligenceDescription:
        'Detect diseases early, analyze risks, and get personalized recommendations for a healthier yield.',
      chatbotCardTitle: 'AI Chatbot & Disease Analysis',
      chatbotCardDescription:
        'Ask questions, upload plant images, get disease detection, risk prediction, and treatment advice.',
      chatbotCardAction: 'Open AI Chatbot',
      historicalCardTitle: 'Historical Analysis',
      historicalCardDescription:
        'Explore five years of satellite data, track field changes, and generate a detailed analysis report.',
      historicalCardAction: 'Open Historical Analysis',
      validation: {
        locationOrCoordsRequired: 'Please enter State and City, or valid Latitude and Longitude coordinates.',
        invalidLatitude: 'Latitude must be a number between -90 and 90.',
        invalidLongitude: 'Longitude must be a number between -180 and 180.',
        invalidFarmSize: 'Please enter a valid farm size greater than 0.',
        cropRequired: 'Please select your primary crop.',
        seasonRequired: 'Please select the active cropping season.',
        invalidYield: 'Please enter a valid non-negative yield value in INR.',
      },
    },
    options: {
      units: {
        Acres: 'Acres',
        Hectares: 'Hectares',
        'Square Metres': 'Square Metres',
      },
      crops: {
        Cotton: 'Cotton',
        Wheat: 'Wheat',
        Rice: 'Rice',
        Soybean: 'Soybean',
        Maize: 'Maize',
        Sugarcane: 'Sugarcane',
        Tomato: 'Tomato',
        Onion: 'Onion',
        Other: 'Other',
      },
      seasons: {
        Kharif: 'Kharif',
        Rabi: 'Rabi',
        Zaid: 'Zaid',
      },
      severities: {
        Low: 'Low',
        Moderate: 'Moderate',
        High: 'High',
        Critical: 'Critical',
      },
      statuses: {
        Completed: 'Completed',
        Demonstration: 'Demonstration',
        'Awaiting Satellite Provider': 'Awaiting Satellite Provider',
      },
    },
    chatbot: {
      title: 'AI Crop Health Assistant',
      subtitle: 'Your intelligent agricultural companion.',
      editFarmLink: 'Edit farm details',
      welcomeMessage:
        'Welcome to CropSense. Ask any question about your crop, upload a clear leaf photograph for preliminary disease analysis, or select a quick action below.',
      inputPlaceholder: 'Ask anything about your crop...',
      sendButton: 'Send',
      uploadImageAria: 'Upload plant or leaf photograph',
      removeImageAria: 'Remove attached image',
      voiceStartAria: 'Start voice input',
      voiceStopAria: 'Stop voice input',
      listeningLabel: 'Listening...',
      speakAria: 'Read response aloud',
      stopSpeakingAria: 'Stop speaking',
      clearChatButton: 'Clear session',
      analyzingLabel: 'Analyzing crop context...',
      analyzingImageLabel: 'Analyzing plant photograph...',
      imageReadyLabel: 'Leaf image attached — ready for analysis',
      quickActionsLabel: 'Quick actions',
      quickActions: {
        detectDisease: 'Detect Crop Disease',
        checkRisk: 'Check Disease Risk',
        preventiveMeasures: 'Suggest Preventive Measures',
        recommendTreatment: 'Recommend Treatment',
        environmentalConditions: 'Analyze Environmental Conditions',
      },
      quickActionPrompts: {
        detectDisease:
          'What early leaf symptoms should I inspect right now on my crop to detect common fungal or bacterial diseases early?',
        checkRisk:
          'Based on my saved crop, location, and season, what are the top disease risks I should watch out for this month?',
        preventiveMeasures:
          'Suggest a practical preventive care schedule to protect my crop from seasonal blight, wilt, and pest vectors.',
        recommendTreatment:
          'What integrated pest and disease management steps are recommended if leaf spots or blight appear in my field?',
        environmentalConditions:
          'How do seasonal humidity, rainfall, and temperature shifts affect disease pressure for my saved crop and region?',
      },
      diseaseCard: {
        diseaseIdentified: 'Disease Identified',
        confidence: 'Confidence',
        severity: 'Severity',
        riskLevel: 'Risk Level',
        visibleSymptoms: 'Visible Symptoms',
        potentialCauses: 'Potential Causes',
        preventiveMeasures: 'Preventive Measures',
        suggestedTreatment: 'Suggested Treatment & Next Steps',
        whenToSeekExpert: 'When to Seek Expert Assistance',
        demoNotice: 'Demonstration Mode — AI vision backend is not configured. Do not treat this placeholder as a real clinical diagnosis.',
        saveReportButton: 'Save to Reports',
        reportSavedButton: 'Saved in Reports',
        defaultDisclaimer:
          'Preliminary image-based assessment only. Always verify with a local agricultural officer or Krishi Vigyan Kendra (KVK) before applying pesticides or chemical treatments.',
      },
      voiceErrors: {
        unsupported: 'Voice recognition is not supported in this browser. Please type your question instead.',
        permissionDenied: 'Microphone permission was denied. Enable microphone access in browser settings to use voice input.',
        generic: 'Could not capture voice input. Please try again.',
        ttsUnsupported: 'Text-to-speech is not supported in this browser.',
      },
      errors: {
        invalidImageType: 'Please upload a valid image file (JPG, PNG, or WebP).',
        imageTooLarge: 'Image must be smaller than 8 MB.',
        requestFailed: 'Could not reach the AI service right now. Please try again.',
        demoFallbackBanner:
          'AI backend key is not configured on the server; displaying clearly labeled demonstration output.',
      },
    },
    historical: {
      title: 'Historical Crop Analysis',
      subtitle: 'Understand how your farmland has changed over time.',
      farmContextTitle: 'Saved Farm Context',
      editOnDashboard: 'Edit on Dashboard',
      coordinatesNotSet: 'Coordinates not entered',
      configTitle: 'Analysis Configuration',
      yearRangeLabel: 'Year Range',
      lastFiveYears: 'Last 5 Years (2022–2026)',
      seasonLabel: 'Season',
      parametersLabel: 'Analysis Parameters',
      generateButton: 'Generate Analysis Report',
      generatingButton: 'Preparing Report...',
      reportQueuedMessage:
        'Historical analysis request recorded in Reports. Live satellite imagery will populate once a data provider is connected.',
      parameters: {
        vegetationHealth: 'Vegetation health',
        vegetationIndex: 'Vegetation index trends',
        cropCoverage: 'Crop coverage',
        waterAvailability: 'Water availability',
        soilCondition: 'Soil & land condition indicators',
        environmentalTrends: 'Environmental trends',
      },
      comingSoonBannerTitle: 'Historical satellite analysis is coming soon.',
      comingSoonBannerBody:
        'Verified five-year satellite imagery and parcel-level vegetation reports will become available once a live Earth observation provider (Sentinel-2, Landsat, or Google Earth Engine) is connected.',
      satellitePanelTitle: 'Satellite Imagery Viewer',
      satelliteCompareToggle: 'Side-by-side comparison',
      primaryYearLabel: 'Primary Year',
      compareYearLabel: 'Compare Year',
      satelliteComingSoonTitle: 'Historical satellite analysis is coming soon.',
      satelliteComingSoonBody:
        'No verified satellite tiles are connected for this farm parcel yet. Once Sentinel-2 or Landsat feeds are configured, you will be able to scrub across five years and inspect side-by-side NDVI composites here.',
      satelliteProviderNote: 'Supported providers ready for integration: Sentinel-2 · Landsat · Google Earth Engine',
      satelliteForYear: 'Satellite imagery for',
      comingSoonShort: 'Coming soon',
      chartsSectionTitle: 'Five-Year Visualization Workspace',
      chartsPreviewNotice:
        'Illustrative schema preview only — awaiting live satellite data provider connection. These reference curves demonstrate chart structure and are not verified measurements of your farm.',
      chartTitles: {
        vegetationHealth: 'Vegetation Health Trends (NDVI)',
        seasonalIndex: 'Seasonal Vegetation Index Profile',
        environmentalTrends: 'Environmental Parameter Trends',
        cropHealthComparison: 'Crop Health & Coverage Comparison',
        fiveYearChange: 'Five-Year Historical Change Summary',
      },
      chartLabels: {
        ndvi: 'NDVI Index',
        healthScore: 'Health Index',
        rainfallMm: 'Rainfall (mm)',
        soilMoisture: 'Soil Moisture (%)',
        cropCoverage: 'Crop Coverage (%)',
        avgTemp: 'Avg Temp (°C)',
      },
    },
    reports: {
      title: 'Crop Health Reports',
      subtitle: 'Review your previous crop health analyses and recommendations.',
      filterAll: 'All Reports',
      filterDisease: 'Disease Analysis',
      filterHistorical: 'Historical Reports',
      searchPlaceholder: 'Search by crop, location, or finding...',
      emptyTitle: 'No crop health reports yet',
      emptyDescription:
        'Run a plant disease analysis in the AI Assistant or generate a historical analysis request to save structured reports here.',
      startAnalysisCta: 'Start Disease Analysis',
      goToHistoricalCta: 'Open Historical Analysis',
      createdOn: 'Created',
      cropLabel: 'Crop',
      locationLabel: 'Location',
      findingLabel: 'Finding',
      severityLabel: 'Severity',
      statusLabel: 'Status',
      viewReport: 'View Report',
      viewRecommendations: 'View Recommendations',
      downloadPdf: 'Download PDF',
      deleteReport: 'Delete report',
      typeDisease: 'Disease Analysis',
      typeHistorical: 'Historical Analysis',
      modalClose: 'Close',
      modalSummaryTitle: 'Analysis Summary',
      modalRecommendationsTitle: 'Recommended Actions',
      modalSymptomsTitle: 'Visible Symptoms',
      modalCausesTitle: 'Potential Causes',
      modalPreventiveTitle: 'Preventive Measures',
      modalExpertTitle: 'When to Consult an Expert',
      pdfSuccessToast: 'PDF report downloaded.',
    },
  },

  hi: {
    brandName: 'CropSense',
    languageLabel: 'भाषा',
    nav: {
      solutions: 'समाधान',
      plans: 'योजनाएं',
      news: 'समाचार',
      tryItFree: 'मुफ़्त आज़माएँ',
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      reports: 'रिपोर्ट्स',
      chatbot: 'एआई सहायक',
      historicalAnalysis: 'ऐतिहासिक विश्लेषण',
      newAnalysis: 'नया विश्लेषण',
      toggleMenu: 'मेनू खोलें',
    },
    home: {
      announcement: 'आज सभी के लिए उपलब्ध! स्मार्ट खेती की शुरुआत यहाँ से होती है।',
      headlineLine1: 'आपकी फसलों को समय से पहले चेतावनी मिलनी चाहिए।',
      headlineLine2: 'हर फसल की सुरक्षा के लिए एक बुद्धिमान प्रणाली।',
      backedBy: 'समर्थित',
      videoUnavailableFallback: 'CropSense कृषि परिदृश्य',
      tryUsButton: 'हमें आज़माएं',
      aboutUsButton: 'हमारे बारे में',
      about: {
        kicker: 'हमारे बारे में',
        heading: 'हर किसान को फसल संकट फैलने से पहले स्पष्ट मार्गदर्शन देने के लिए निर्मित।',
        paragraph1:
          'CropSense भारतीय कृषि के लिए एआई-आधारित पत्ती रोग जांच, आवाज़-सक्षम कृषि सलाह और ऐतिहासिक खेत विश्लेषण को एक सरल और विश्वसनीय मंच पर लाता है।',
        paragraph2:
          'आपके राज्य, जिला, भूमि क्षेत्र, फसल और मौसम की जानकारी को अंग्रेज़ी, हिंदी, मराठी और कन्नड़ में त्वरित विश्लेषण के साथ जोड़कर, CropSense किसानों को समय रहते उपज बचाने में मदद करता है।',
        pillar1Title: 'त्वरित रोग पहचान',
        pillar1Desc:
          'प्रारंभिक रोग पहचान, गंभीरता मूल्यांकन और व्यावहारिक उपचार सुझावों के लिए पत्ती की तस्वीर अपलोड या स्कैन करें।',
        pillar2Title: 'बहुभाषी और आवाज़ सहायता',
        pillar2Desc:
          'अपने सहेजे गए खेत विवरण के आधार पर अंग्रेज़ी, हिंदी, मराठी और कन्नड़ में लिखकर या बोलकर सवाल पूछें।',
        pillar3Title: '5-वर्षीय खेत विश्लेषण',
        pillar3Desc:
          'मौसमी बदलावों की तुलना करें, पर्यावरणीय रुझान समझें और रिकॉर्ड के लिए पीडीएफ रिपोर्ट डाउनलोड करें।',
        startCta: 'अभी CropSense आज़माएं',
        chatbotCta: 'एआई सहायक खोलें',
        footerTagline: 'हर फसल की सुरक्षा के लिए पूर्वानुमानित कृषि बुद्धिमत्ता।',
      },
    },
    dashboard: {
      farmDetailsTitle: 'खेत का विवरण',
      farmDetailsSubtitle: 'सटीक विश्लेषण के लिए अपने खेत की जानकारी प्रदान करें।',
      locationGroup: 'स्थान',
      farmInfoGroup: 'खेत की जानकारी',
      stateLabel: 'राज्य',
      cityLabel: 'शहर / जिला',
      cityPlaceholder: 'शहर खोजें या लिखें',
      latitudeLabel: 'अक्षांश (Latitude)',
      latitudePlaceholder: 'जैसे 20.9320',
      longitudeLabel: 'देशांतर (Longitude)',
      longitudePlaceholder: 'जैसे 77.7523',
      optionalTag: 'वैकल्पिक',
      requiredTag: 'आवश्यक',
      locationOrCoordsHint: 'राज्य और शहर दर्ज करें, या सटीक अक्षांश और देशांतर दें।',
      farmSizeLabel: 'खेत का आकार',
      farmSizePlaceholder: 'क्षेत्रफल दर्ज करें',
      cropLabel: 'फसल',
      cropSearchPlaceholder: 'फसल चुनें',
      seasonLabel: 'मौसम (सीज़न)',
      yieldLabel: 'पिछले वर्ष की उपज का मूल्य (₹)',
      yieldPlaceholder: 'जैसे 125000',
      saveButton: 'खेत का विवरण सहेजें',
      savedSuccess: 'खेत का विवरण सहेजा गया। एआई सहायक और ऐतिहासिक विश्लेषण अपडेट हो गए हैं।',
      editHint: 'आप कभी भी अपने खेत का विवरण बदल सकते हैं।',
      intelligenceKicker: 'कृषि बुद्धिमत्ता',
      intelligenceHeadline: 'आपकी फसल का स्वास्थ्य, एआई द्वारा संचालित',
      intelligenceDescription:
        'रोगों की जल्दी पहचान करें, जोखिम का विश्लेषण करें, और बेहतर उपज के लिए व्यक्तिगत सुझाव प्राप्त करें।',
      chatbotCardTitle: 'एआई चैटबॉट और रोग विश्लेषण',
      chatbotCardDescription:
        'प्रश्न पूछें, पौधे की तस्वीर अपलोड करें, रोग पहचान, जोखिम पूर्वानुमान और उपचार सलाह प्राप्त करें।',
      chatbotCardAction: 'एआई चैटबॉट खोलें',
      historicalCardTitle: 'ऐतिहासिक विश्लेषण',
      historicalCardDescription:
        'पाँच वर्षों के सैटेलाइट डेटा की समीक्षा करें, खेत में बदलाव देखें और विस्तृत रिपोर्ट बनाएं।',
      historicalCardAction: 'ऐतिहासिक विश्लेषण खोलें',
      validation: {
        locationOrCoordsRequired: 'कृपया राज्य और शहर, या मान्य अक्षांश और देशांतर दर्ज करें।',
        invalidLatitude: 'अक्षांश -90 से 90 के बीच एक संख्या होनी चाहिए।',
        invalidLongitude: 'देशांतर -180 से 180 के बीच एक संख्या होनी चाहिए।',
        invalidFarmSize: 'कृपया 0 से बड़ा मान्य खेत का आकार दर्ज करें।',
        cropRequired: 'कृपया अपनी मुख्य फसल चुनें।',
        seasonRequired: 'कृपया वर्तमान फसल मौसम चुनें।',
        invalidYield: 'कृपया रुपये में मान्य उपज मूल्य दर्ज करें।',
      },
    },
    options: {
      units: {
        Acres: 'एकड़',
        Hectares: 'हेक्टेयर',
        'Square Metres': 'वर्ग मीटर',
      },
      crops: {
        Cotton: 'कपास',
        Wheat: 'गेहूँ',
        Rice: 'धान (चावल)',
        Soybean: 'सोयाबीन',
        Maize: 'मक्का',
        Sugarcane: 'गन्ना',
        Tomato: 'टमाटर',
        Onion: 'प्याज़',
        Other: 'अन्य',
      },
      seasons: {
        Kharif: 'खरीफ',
        Rabi: 'रबी',
        Zaid: 'ज़ायद',
      },
      severities: {
        Low: 'कम',
        Moderate: 'मध्यम',
        High: 'उच्च',
        Critical: 'गंभीर',
      },
      statuses: {
        Completed: 'पूर्ण',
        Demonstration: 'प्रदर्शन',
        'Awaiting Satellite Provider': 'सैटेलाइट डेटा प्रदाता की प्रतीक्षा',
      },
    },
    chatbot: {
      title: 'एआई फसल स्वास्थ्य सहायक',
      subtitle: 'आपका बुद्धिमान कृषि साथी।',
      editFarmLink: 'खेत विवरण बदलें',
      welcomeMessage:
        'CropSense में आपका स्वागत है। अपनी फसल से जुड़ा कोई भी प्रश्न पूछें, प्रारंभिक रोग जांच के लिए पत्ती की स्पष्ट तस्वीर अपलोड करें, या नीचे दिए गए त्वरित विकल्प चुनें।',
      inputPlaceholder: 'अपनी फसल के बारे में कुछ भी पूछें...',
      sendButton: 'भेजें',
      uploadImageAria: 'पौधे या पत्ती की तस्वीर अपलोड करें',
      removeImageAria: 'तस्वीर हटाएँ',
      voiceStartAria: 'वॉइस इनपुट शुरू करें',
      voiceStopAria: 'वॉइस इनपुट रोकें',
      listeningLabel: 'सुन रहे हैं...',
      speakAria: 'उत्तर सुनें',
      stopSpeakingAria: 'बोलना बंद करें',
      clearChatButton: 'चैट साफ़ करें',
      analyzingLabel: 'फसल जानकारी का विश्लेषण हो रहा है...',
      analyzingImageLabel: 'पौधे की तस्वीर का विश्लेषण हो रहा है...',
      imageReadyLabel: 'पत्ती की तस्वीर संलग्न है — विश्लेषण के लिए तैयार',
      quickActionsLabel: 'त्वरित विकल्प',
      quickActions: {
        detectDisease: 'फसल रोग पहचानें',
        checkRisk: 'रोग जोखिम जाँचें',
        preventiveMeasures: 'रोकथाम के उपाय सुझाएँ',
        recommendTreatment: 'उपचार की सलाह दें',
        environmentalConditions: 'पर्यावरणीय स्थिति का विश्लेषण करें',
      },
      quickActionPrompts: {
        detectDisease: 'मेरी फसल में फफूंद या जीवाणु रोगों की जल्दी पहचान के लिए पत्तियों पर कौन से प्रारंभिक लक्षण देखने चाहिए?',
        checkRisk: 'मेरी सहेजी गई फसल, स्थान और मौसम के आधार पर इस महीने कौन से प्रमुख रोग जोखिम हैं?',
        preventiveMeasures: 'मेरी फसल को मौसमी झुलसा, उकठा और कीटों से बचाने के लिए व्यावहारिक रोकथाम योजना बताएं।',
        recommendTreatment: 'यदि खेत में पत्तियों पर धब्बे या झुलसा दिखे तो समन्वित रोग प्रबंधन के क्या कदम उठाएं?',
        environmentalConditions: 'मौसमी नमी, वर्षा और तापमान में बदलाव मेरी फसल के रोग दबाव को कैसे प्रभावित करते हैं?',
      },
      diseaseCard: {
        diseaseIdentified: 'पहचाना गया रोग',
        confidence: 'विश्वास स्तर',
        severity: 'गंभीरता',
        riskLevel: 'जोखिम स्तर',
        visibleSymptoms: 'दिखने वाले लक्षण',
        potentialCauses: 'संभावित कारण',
        preventiveMeasures: 'रोकथाम के उपाय',
        suggestedTreatment: 'सुझाया गया उपचार और अगले कदम',
        whenToSeekExpert: 'कृषि विशेषज्ञ से कब संपर्क करें',
        demoNotice: 'प्रदर्शन मोड — एआई विज़न बैकएंड कॉन्फ़िगर नहीं है। इसे वास्तविक निदान न मानें।',
        saveReportButton: 'रिपोर्ट में सहेजें',
        reportSavedButton: 'रिपोर्ट में सहेजा गया',
        defaultDisclaimer:
          'यह तस्वीर आधारित प्रारंभिक मूल्यांकन है। किसी भी कीटनाशक या रासायनिक उपचार से पहले स्थानीय कृषि अधिकारी या कृषि विज्ञान केंद्र (KVK) से पुष्टि अवश्य करें।',
      },
      voiceErrors: {
        unsupported: 'इस ब्राउज़र में वॉइस पहचान समर्थित नहीं है। कृपया अपना प्रश्न टाइप करें।',
        permissionDenied: 'माइक्रोफ़ोन की अनुमति अस्वीकार की गई। वॉइस इनपुट के लिए ब्राउज़र सेटिंग्स में अनुमति दें।',
        generic: 'आवाज़ रिकॉर्ड नहीं हो सकी। कृपया पुनः प्रयास करें।',
        ttsUnsupported: 'इस ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है।',
      },
      errors: {
        invalidImageType: 'कृपया मान्य तस्वीर फ़ाइल (JPG, PNG या WebP) अपलोड करें।',
        imageTooLarge: 'तस्वीर का आकार 8 MB से कम होना चाहिए।',
        requestFailed: 'अभी एआई सेवा से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।',
        demoFallbackBanner: 'सर्वर पर एआई कुंजी कॉन्फ़िगर नहीं है; स्पष्ट रूप से चिह्नित प्रदर्शन उत्तर दिखाया जा रहा है।',
      },
    },
    historical: {
      title: 'ऐतिहासिक फसल विश्लेषण',
      subtitle: 'समय के साथ आपकी कृषि भूमि में हुए बदलावों को समझें।',
      farmContextTitle: 'सहेजा गया खेत संदर्भ',
      editOnDashboard: 'डैशबोर्ड पर संपादित करें',
      coordinatesNotSet: 'निर्देशांक दर्ज नहीं हैं',
      configTitle: 'विश्लेषण सेटिंग्स',
      yearRangeLabel: 'वर्ष अवधि',
      lastFiveYears: 'पिछले 5 वर्ष (2022–2026)',
      seasonLabel: 'मौसम',
      parametersLabel: 'विश्लेषण पैरामीटर',
      generateButton: 'विश्लेषण रिपोर्ट बनाएं',
      generatingButton: 'रिपोर्ट तैयार हो रही है...',
      reportQueuedMessage:
        'ऐतिहासिक विश्लेषण अनुरोध रिपोर्ट्स में दर्ज हो गया है। सैटेलाइट प्रदाता जुड़ने पर लाइव डेटा उपलब्ध होगा।',
      parameters: {
        vegetationHealth: 'वनस्पति स्वास्थ्य',
        vegetationIndex: 'वनस्पति सूचकांक रुझान',
        cropCoverage: 'फसल आवरण',
        waterAvailability: 'जल उपलब्धता',
        soilCondition: 'मिट्टी और भूमि स्थिति संकेतक',
        environmentalTrends: 'पर्यावरणीय रुझान',
      },
      comingSoonBannerTitle: 'ऐतिहासिक सैटेलाइट विश्लेषण जल्द ही आ रहा है।',
      comingSoonBannerBody:
        'जब लाइव सैटेलाइट डेटा प्रदाता (Sentinel-2, Landsat या Google Earth Engine) जोड़ा जाएगा, तब पाँच वर्षों की सत्यापित छवियाँ और रिपोर्ट उपलब्ध होंगी।',
      satellitePanelTitle: 'सैटेलाइट इमेजरी व्यूअर',
      satelliteCompareToggle: 'साथ-साथ तुलना',
      primaryYearLabel: 'मुख्य वर्ष',
      compareYearLabel: 'तुलना वर्ष',
      satelliteComingSoonTitle: 'ऐतिहासिक सैटेलाइट विश्लेषण जल्द ही आ रहा है।',
      satelliteComingSoonBody:
        'इस खेत के लिए अभी कोई सत्यापित सैटेलाइट इमेजरी जुड़ी नहीं है। डेटा प्रदाता कनेक्ट होने के बाद आप पाँच वर्षों की तुलना कर सकेंगे।',
      satelliteProviderNote: 'एकीकरण के लिए तैयार प्रदाता: Sentinel-2 · Landsat · Google Earth Engine',
      satelliteForYear: 'सैटेलाइट इमेजरी —',
      comingSoonShort: 'जल्द ही आ रहा है',
      chartsSectionTitle: 'पाँच-वर्षीय विश्लेषण ग्राफ़',
      chartsPreviewNotice:
        'यह केवल चार्ट संरचना का उदाहरण है — लाइव सैटेलाइट प्रदाता जुड़ने की प्रतीक्षा है। ये आपके खेत के सत्यापित आंकड़े नहीं हैं।',
      chartTitles: {
        vegetationHealth: 'वनस्पति स्वास्थ्य रुझान (NDVI)',
        seasonalIndex: 'मौसमी वनस्पति सूचकांक',
        environmentalTrends: 'पर्यावरणीय पैरामीटर रुझान',
        cropHealthComparison: 'फसल स्वास्थ्य और आवरण तुलना',
        fiveYearChange: 'पाँच-वर्षीय ऐतिहासिक बदलाव सारांश',
      },
      chartLabels: {
        ndvi: 'NDVI सूचकांक',
        healthScore: 'स्वास्थ्य सूचकांक',
        rainfallMm: 'वर्षा (मिमी)',
        soilMoisture: 'मिट्टी की नमी (%)',
        cropCoverage: 'फसल आवरण (%)',
        avgTemp: 'औसत तापमान (°C)',
      },
    },
    reports: {
      title: 'फसल स्वास्थ्य रिपोर्ट्स',
      subtitle: 'अपने पिछले फसल स्वास्थ्य विश्लेषण और सुझावों की समीक्षा करें।',
      filterAll: 'सभी रिपोर्ट्स',
      filterDisease: 'रोग विश्लेषण',
      filterHistorical: 'ऐतिहासिक रिपोर्ट्स',
      searchPlaceholder: 'फसल, स्थान या परिणाम खोजें...',
      emptyTitle: 'अभी कोई फसल स्वास्थ्य रिपोर्ट नहीं है',
      emptyDescription:
        'यहाँ रिपोर्ट सहेजने के लिए एआई सहायक में पौधे का रोग विश्लेषण करें या ऐतिहासिक विश्लेषण अनुरोध बनाएं।',
      startAnalysisCta: 'रोग विश्लेषण शुरू करें',
      goToHistoricalCta: 'ऐतिहासिक विश्लेषण खोलें',
      createdOn: 'तिथि',
      cropLabel: 'फसल',
      locationLabel: 'स्थान',
      findingLabel: 'परिणाम',
      severityLabel: 'गंभीरता',
      statusLabel: 'स्थिति',
      viewReport: 'रिपोर्ट देखें',
      viewRecommendations: 'सुझाव देखें',
      downloadPdf: 'PDF डाउनलोड करें',
      deleteReport: 'रिपोर्ट हटाएँ',
      typeDisease: 'रोग विश्लेषण',
      typeHistorical: 'ऐतिहासिक विश्लेषण',
      modalClose: 'बंद करें',
      modalSummaryTitle: 'विश्लेषण सारांश',
      modalRecommendationsTitle: 'सुझाए गए कदम',
      modalSymptomsTitle: 'दिखने वाले लक्षण',
      modalCausesTitle: 'संभावित कारण',
      modalPreventiveTitle: 'रोकथाम के उपाय',
      modalExpertTitle: 'विशेषज्ञ से कब सलाह लें',
      pdfSuccessToast: 'PDF रिपोर्ट डाउनलोड हो गई।',
    },
  },

  mr: {
    brandName: 'CropSense',
    languageLabel: 'भाषा',
    nav: {
      solutions: 'उपाय',
      plans: 'योजना',
      news: 'बातम्या',
      tryItFree: 'मोफत वापरून पहा',
      home: 'मुख्यपृष्ठ',
      dashboard: 'डॅशबोर्ड',
      reports: 'अहवाल',
      chatbot: 'एआय सहाय्यक',
      historicalAnalysis: 'ऐतिहासिक विश्लेषण',
      newAnalysis: 'नवीन विश्लेषण',
      toggleMenu: 'मेनू उघडा',
    },
    home: {
      announcement: 'आज सर्वांसाठी उपलब्ध! स्मार्ट शेतीची सुरुवात येथून होते.',
      headlineLine1: 'तुमच्या पिकांना वेळेआधीच इशारा मिळायला हवा.',
      headlineLine2: 'प्रत्येक हंगामाचे रक्षण करणारी एक बुद्धिमान प्रणाली.',
      backedBy: 'समर्थित',
      videoUnavailableFallback: 'CropSense कृषी निसर्गदृश्य',
      tryUsButton: 'आम्हाला वापरून पहा',
      aboutUsButton: 'आमच्याबद्दल',
      about: {
        kicker: 'आमच्याबद्दल',
        heading: 'पिकावरील ताण पसरण्यापूर्वी प्रत्येक शेतकऱ्याला अचूक मार्गदर्शन देण्यासाठी निर्मित.',
        paragraph1:
          'CropSense भारतीय शेतीसाठी एआय-आधारित पान रोग निदान, व्हॉइस-सक्षम कृषी सल्ला आणि ऐतिहासिक शेत विश्लेषण एका सोप्या व्यासपीठावर एकत्र आणते.',
        paragraph2:
          'तुमचे राज्य, जिल्हा, क्षेत्रफळ, पीक आणि हंगाम यांच्या माहितीसह इंग्रजी, हिंदी, मराठी आणि कन्नडमध्ये तत्काळ निदान देऊन, CropSense उत्पादनाचे संरक्षण करण्यास मदत करते.',
        pillar1Title: 'वेळेआधी रोग ओळख',
        pillar1Desc:
          'प्राथमिक रोग निदान, तीव्रता आणि प्रतिबंधात्मक उपायांसाठी पानाचा फोटो अपलोड किंवा स्कॅन करा.',
        pillar2Title: 'बहुभाषिक व आवाज सहाय्य',
        pillar2Desc:
          'जतन केलेल्या शेताच्या तपशिलानुसार इंग्रजी, हिंदी, मराठी आणि कन्नडमध्ये टाइप किंवा बोलून प्रश्न विचारा.',
        pillar3Title: '५-वर्षीय शेत विश्लेषण',
        pillar3Desc:
          'हंगामी बदलांची तुलना करा, हवामानाचे कल तपासा आणि नोंदीसाठी पीडीएफ अहवाल तयार करा.',
        startCta: 'आता CropSense सुरू करा',
        chatbotCta: 'एआय सहाय्यक उघडा',
        footerTagline: 'प्रत्येक हंगामासाठी पूर्वसूचना देणारी स्मार्ट पीक आरोग्य प्रणाली.',
      },
    },
    dashboard: {
      farmDetailsTitle: 'शेताचा तपशील',
      farmDetailsSubtitle: 'अचूक विश्लेषणासाठी तुमच्या शेताची माहिती द्या.',
      locationGroup: 'स्थान',
      farmInfoGroup: 'शेताची माहिती',
      stateLabel: 'राज्य',
      cityLabel: 'शहर / जिल्हा',
      cityPlaceholder: 'शहर शोधा किंवा लिहा',
      latitudeLabel: 'अक्षांश (Latitude)',
      latitudePlaceholder: 'उदा. 20.9320',
      longitudeLabel: 'रेखांश (Longitude)',
      longitudePlaceholder: 'उदा. 77.7523',
      optionalTag: 'ऐच्छिक',
      requiredTag: 'आवश्यक',
      locationOrCoordsHint: 'राज्य आणि शहर प्रविष्ट करा किंवा अचूक अक्षांश व रेखांश द्या.',
      farmSizeLabel: 'शेताचे क्षेत्रफळ',
      farmSizePlaceholder: 'क्षेत्रफळ लिहा',
      cropLabel: 'पीक',
      cropSearchPlaceholder: 'पीक निवडा',
      seasonLabel: 'हंगाम',
      yieldLabel: 'मागील वर्षाचे उत्पन्न मूल्य (₹)',
      yieldPlaceholder: 'उदा. 125000',
      saveButton: 'शेताचा तपशील जतन करा',
      savedSuccess: 'शेताचा तपशील जतन झाला. एआय सहाय्यक आणि ऐतिहासिक विश्लेषण अद्यतनित झाले आहे.',
      editHint: 'तुम्ही शेताची माहिती कधीही बदलू शकता.',
      intelligenceKicker: 'कृषी बुद्धिमत्ता',
      intelligenceHeadline: 'तुमच्या पिकाचे आरोग्य, एआय द्वारे सक्षम',
      intelligenceDescription:
        'रोगांचे लवकर निदान करा, धोक्याचे विश्लेषण करा आणि चांगल्या उत्पादनासाठी वैयक्तिक सल्ला मिळवा.',
      chatbotCardTitle: 'एआय चॅटबॉट आणि रोग विश्लेषण',
      chatbotCardDescription:
        'प्रश्न विचारा, वनस्पतींचे फोटो अपलोड करा, रोग निदान, धोका अंदाज आणि उपचार सल्ला मिळवा.',
      chatbotCardAction: 'एआय चॅटबॉट उघडा',
      historicalCardTitle: 'ऐतिहासिक विश्लेषण',
      historicalCardDescription:
        'पाच वर्षांचा उपग्रह डेटा पहा, शेतातील बदलांचा मागोवा घ्या आणि सविस्तर अहवाल तयार करा.',
      historicalCardAction: 'ऐतिहासिक विश्लेषण उघडा',
      validation: {
        locationOrCoordsRequired: 'कृपया राज्य आणि शहर किंवा वैध अक्षांश व रेखांश प्रविष्ट करा.',
        invalidLatitude: 'अक्षांश -90 ते 90 दरम्यानची संख्या असावी.',
        invalidLongitude: 'रेखांश -180 ते 180 दरम्यानची संख्या असावी.',
        invalidFarmSize: 'कृपया 0 पेक्षा जास्त वैध शेताचे क्षेत्रफळ प्रविष्ट करा.',
        cropRequired: 'कृपया तुमचे मुख्य पीक निवडा.',
        seasonRequired: 'कृपया हंगाम निवडा.',
        invalidYield: 'कृपया रुपयांत वैध उत्पन्न मूल्य प्रविष्ट करा.',
      },
    },
    options: {
      units: {
        Acres: 'एकर',
        Hectares: 'हेक्टर',
        'Square Metres': 'चौरस मीटर',
      },
      crops: {
        Cotton: 'कापूस',
        Wheat: 'गहू',
        Rice: 'भात (तांदूळ)',
        Soybean: 'सोयाबीन',
        Maize: 'मका',
        Sugarcane: 'ऊस',
        Tomato: 'टोमॅटो',
        Onion: 'कांदा',
        Other: 'इतर',
      },
      seasons: {
        Kharif: 'खरीप',
        Rabi: 'रब्बी',
        Zaid: 'उन्हाळी (झायद)',
      },
      severities: {
        Low: 'कमी',
        Moderate: 'मध्यम',
        High: 'जास्त',
        Critical: 'गंभीर',
      },
      statuses: {
        Completed: 'पूर्ण',
        Demonstration: 'प्रात्यक्षिक',
        'Awaiting Satellite Provider': 'उपग्रह प्रदात्याच्या प्रतीक्षेत',
      },
    },
    chatbot: {
      title: 'एआय पीक आरोग्य सहाय्यक',
      subtitle: 'तुमचा बुद्धिमान शेती साथीदार.',
      editFarmLink: 'शेताचा तपशील बदला',
      welcomeMessage:
        'CropSense मध्ये स्वागत आहे. तुमच्या पिकाबद्दल कोणताही प्रश्न विचारा, प्राथमिक रोग तपासणीसाठी पानाचा स्पष्ट फोटो अपलोड करा किंवा खालील जलद पर्याय निवडा.',
      inputPlaceholder: 'तुमच्या पिकाबद्दल काहीही विचारा...',
      sendButton: 'पाठवा',
      uploadImageAria: 'वनस्पती किंवा पानाचा फोटो अपलोड करा',
      removeImageAria: 'फोटो काढा',
      voiceStartAria: 'आवाज इनपुट सुरू करा',
      voiceStopAria: 'आवाज इनपुट थांबवा',
      listeningLabel: 'ऐकत आहे...',
      speakAria: 'उत्तर ऐका',
      stopSpeakingAria: 'बोलणे थांबवा',
      clearChatButton: 'संवाद साफ करा',
      analyzingLabel: 'पीक माहितीचे विश्लेषण सुरू आहे...',
      analyzingImageLabel: 'पानाच्या फोटोचे विश्लेषण सुरू आहे...',
      imageReadyLabel: 'पानाचा फोटो जोडला आहे — विश्लेषणासाठी तयार',
      quickActionsLabel: 'जलद कृती',
      quickActions: {
        detectDisease: 'पीक रोग ओळखा',
        checkRisk: 'रोग धोका तपासा',
        preventiveMeasures: 'प्रतिबंधात्मक उपाय सुचवा',
        recommendTreatment: 'उपचार सुचवा',
        environmentalConditions: 'हवामान स्थितीचे विश्लेषण करा',
      },
      quickActionPrompts: {
        detectDisease: 'माझ्या पिकावरील बुरशीजन्य किंवा जिवाणूजन्य रोगांची लवकर ओळख करण्यासाठी पानांवर कोणती प्राथमिक लक्षणे पाहावीत?',
        checkRisk: 'माझ्या जतन केलेल्या पीक, ठिकाण आणि हंगामानुसार या महिन्यात कोणत्या रोगांचा धोका जास्त आहे?',
        preventiveMeasures: 'माझ्या पिकाला हंगामी करपा, मर आणि किडींपासून वाचवण्यासाठी प्रतिबंधात्मक वेळापत्रक सुचवा.',
        recommendTreatment: 'शेतात पानांवर ठिपके किंवा करपा दिसल्यास एकात्मिक रोग व्यवस्थापनाचे कोणते उपाय करावेत?',
        environmentalConditions: 'हंगामी आर्द्रता, पाऊस आणि तापमानातील बदल माझ्या पिकाच्या रोगप्रसारावर कसा परिणाम करतात?',
      },
      diseaseCard: {
        diseaseIdentified: 'आढळलेला रोग',
        confidence: 'खात्री स्तर',
        severity: 'तीव्रता',
        riskLevel: 'धोका पातळी',
        visibleSymptoms: 'दिसणारी लक्षणे',
        potentialCauses: 'संभाव्य कारणे',
        preventiveMeasures: 'प्रतिबंधात्मक उपाय',
        suggestedTreatment: 'सुचवलेले उपचार व पुढील पावले',
        whenToSeekExpert: 'कृषी तज्ज्ञांचा सल्ला कधी घ्यावा',
        demoNotice: 'प्रात्यक्षिक मोड — एआय व्हिजन सर्व्हर कॉन्फिगर केलेला नाही. हे खरे निदान समजू नका.',
        saveReportButton: 'अहवालात जतन करा',
        reportSavedButton: 'अहवालात जतन केले',
        defaultDisclaimer:
          'हे छायाचित्रावर आधारित प्राथमिक मूल्यांकन आहे. कोणतीही फवारणी किंवा रासायनिक उपचार करण्यापूर्वी कृषी अधिकारी किंवा कृषी विज्ञान केंद्र (KVK) यांचा सल्ला नक्की घ्या.',
      },
      voiceErrors: {
        unsupported: 'या ब्राउझरमध्ये आवाज ओळख उपलब्ध नाही. कृपया तुमचा प्रश्न टाईप करा.',
        permissionDenied: 'मायक्रोफोनची परवानगी नाकारली आहे. ब्राउझर सेटिंग्जमध्ये परवानगी द्या.',
        generic: 'आवाज नोंदवता आला नाही. कृपया पुन्हा प्रयत्न करा.',
        ttsUnsupported: 'या ब्राउझरमध्ये आवाज वाचन उपलब्ध नाही.',
      },
      errors: {
        invalidImageType: 'कृपया वैध इमेज फाइल (JPG, PNG किंवा WebP) अपलोड करा.',
        imageTooLarge: 'फोटोचा आकार 8 MB पेक्षा कमी असावा.',
        requestFailed: 'एआय सेवेशी संपर्क साधता आला नाही. कृपया पुन्हा प्रयत्न करा.',
        demoFallbackBanner: 'सर्व्हरवर एआय की उपलब्ध नाही; स्पष्टपणे दर्शवलेले प्रात्यक्षिक उत्तर दाखवले आहे.',
      },
    },
    historical: {
      title: 'ऐतिहासिक पीक विश्लेषण',
      subtitle: 'काळानुसार तुमच्या शेतजमिनीत झालेले बदल समजून घ्या.',
      farmContextTitle: 'जतन केलेला शेत संदर्भ',
      editOnDashboard: 'डॅशबोर्डवर बदला',
      coordinatesNotSet: 'निर्देशांक दिलेले नाहीत',
      configTitle: 'विश्लेषण मांडणी',
      yearRangeLabel: 'वर्ष कालावधी',
      lastFiveYears: 'मागील 5 वर्षे (2022–2026)',
      seasonLabel: 'हंगाम',
      parametersLabel: 'विश्लेषण घटक',
      generateButton: 'विश्लेषण अहवाल तयार करा',
      generatingButton: 'अहवाल तयार होत आहे...',
      reportQueuedMessage:
        'ऐतिहासिक विश्लेषणाची विनंती अहवालांमध्ये नोंदवली गेली आहे. उपग्रह डेटा प्रदाता जोडल्यावर थेट माहिती दिसेल.',
      parameters: {
        vegetationHealth: 'वनस्पती आरोग्य',
        vegetationIndex: 'वनस्पती निर्देशांक कल',
        cropCoverage: 'पीक आच्छादन',
        waterAvailability: 'पाण्याची उपलब्धता',
        soilCondition: 'माती आणि जमीन स्थिती दर्शक',
        environmentalTrends: 'पर्यावरणीय कल',
      },
      comingSoonBannerTitle: 'ऐतिहासिक उपग्रह विश्लेषण लवकरच येत आहे.',
      comingSoonBannerBody:
        'Sentinel-2, Landsat किंवा Google Earth Engine सारखा थेट उपग्रह प्रदाता जोडल्यावर पाच वर्षांचे सत्यापित नकाशे व अहवाल उपलब्ध होतील.',
      satellitePanelTitle: 'उपग्रह प्रतिमा दर्शक',
      satelliteCompareToggle: 'शेजारी-शेजारी तुलना',
      primaryYearLabel: 'मुख्य वर्ष',
      compareYearLabel: 'तुलना वर्ष',
      satelliteComingSoonTitle: 'ऐतिहासिक उपग्रह विश्लेषण लवकरच येत आहे.',
      satelliteComingSoonBody:
        'या शेतासाठी अद्याप कोणतीही थेट उपग्रह प्रतिमा जोडलेली नाही. डेटा प्रदाता जोडल्यानंतर तुम्ही पाच वर्षांची तुलना करू शकाल.',
      satelliteProviderNote: 'जोडणीसाठी सज्ज प्रदाते: Sentinel-2 · Landsat · Google Earth Engine',
      satelliteForYear: 'उपग्रह प्रतिमा —',
      comingSoonShort: 'लवकरच येत आहे',
      chartsSectionTitle: 'पाच-वर्षीय आलेख कार्यक्षेत्र',
      chartsPreviewNotice:
        'केवळ आलेख रचनेचे प्रात्यक्षिक — थेट उपग्रह डेटा प्रदात्याची प्रतीक्षा आहे. ही तुमच्या शेताची सत्यापित मोजमापे नाहीत.',
      chartTitles: {
        vegetationHealth: 'वनस्पती आरोग्य कल (NDVI)',
        seasonalIndex: 'हंगामी वनस्पती निर्देशांक',
        environmentalTrends: 'पर्यावरणीय घटक कल',
        cropHealthComparison: 'पीक आरोग्य आणि आच्छादन तुलना',
        fiveYearChange: 'पाच-वर्षीय ऐतिहासिक बदल सारांश',
      },
      chartLabels: {
        ndvi: 'NDVI निर्देशांक',
        healthScore: 'आरोग्य निर्देशांक',
        rainfallMm: 'पाऊस (मिमी)',
        soilMoisture: 'मातीतील ओलावा (%)',
        cropCoverage: 'पीक आच्छादन (%)',
        avgTemp: 'सरासरी तापमान (°C)',
      },
    },
    reports: {
      title: 'पीक आरोग्य अहवाल',
      subtitle: 'तुमच्या मागील पीक आरोग्य विश्लेषणांची आणि शिफारशींची पुनरावलोकने पहा.',
      filterAll: 'सर्व अहवाल',
      filterDisease: 'रोग विश्लेषण',
      filterHistorical: 'ऐतिहासिक अहवाल',
      searchPlaceholder: 'पीक, ठिकाण किंवा निष्कर्ष शोधा...',
      emptyTitle: 'अद्याप कोणताही पीक आरोग्य अहवाल नाही',
      emptyDescription:
        'येथे अहवाल जतन करण्यासाठी एआय सहाय्यकामध्ये रोग विश्लेषण करा किंवा ऐतिहासिक विश्लेषण विनंती तयार करा.',
      startAnalysisCta: 'रोग विश्लेषण सुरू करा',
      goToHistoricalCta: 'ऐतिहासिक विश्लेषण उघडा',
      createdOn: 'दिनांक',
      cropLabel: 'पीक',
      locationLabel: 'ठिकाण',
      findingLabel: 'निष्कर्ष',
      severityLabel: 'तीव्रता',
      statusLabel: 'स्थिती',
      viewReport: 'अहवाल पहा',
      viewRecommendations: 'शिफारशी पहा',
      downloadPdf: 'PDF डाउनलोड करा',
      deleteReport: 'अहवाल हटवा',
      typeDisease: 'रोग विश्लेषण',
      typeHistorical: 'ऐतिहासिक विश्लेषण',
      modalClose: 'बंद करा',
      modalSummaryTitle: 'विश्लेषण सारांश',
      modalRecommendationsTitle: 'सुचवलेल्या कृती',
      modalSymptomsTitle: 'दिसणारी लक्षणे',
      modalCausesTitle: 'संभाव्य कारणे',
      modalPreventiveTitle: 'प्रतिबंधात्मक उपाय',
      modalExpertTitle: 'तज्ज्ञांचा सल्ला कधी घ्यावा',
      pdfSuccessToast: 'PDF अहवाल डाउनलोड झाला.',
    },
  },

  kn: {
    brandName: 'CropSense',
    languageLabel: 'ಭಾಷೆ',
    nav: {
      solutions: 'ಪರಿಹಾರಗಳು',
      plans: 'ಯೋಜನೆಗಳು',
      news: 'ಸುದ್ದಿ',
      tryItFree: 'ಉಚಿತವಾಗಿ ಪ್ರಯತ್ನಿಸಿ',
      home: 'ಮುಖಪುಟ',
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      reports: 'ವರದಿಗಳು',
      chatbot: 'AI ಸಹಾಯಕ',
      historicalAnalysis: 'ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ',
      newAnalysis: 'ಹೊಸ ವಿಶ್ಲೇಷಣೆ',
      toggleMenu: 'ಮೆನು ತೆರೆಯಿರಿ',
    },
    home: {
      announcement: 'ಇಂದು ಎಲ್ಲರಿಗೂ ಲಭ್ಯವಿದೆ! ಚುರುಕಾದ ಕೃಷಿ ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.',
      headlineLine1: 'ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ಮುಂಚಿತ ಎಚ್ಚರಿಕೆ ಅಗತ್ಯವಿದೆ.',
      headlineLine2: 'ಪ್ರತಿ ಕೊಯ್ಲನ್ನು ರಕ್ಷಿಸಲು ಒಂದು ಬುದ್ಧಿವಂತ ವ್ಯವಸ್ಥೆ.',
      backedBy: 'ಬೆಂಬಲಿತ',
      videoUnavailableFallback: 'CropSense ಕೃಷಿ ಭೂದೃಶ್ಯ',
      tryUsButton: 'ನಮ್ಮನ್ನು ಪ್ರಯತ್ನಿಸಿ',
      aboutUsButton: 'ನಮ್ಮ ಬಗ್ಗೆ',
      about: {
        kicker: 'ನಮ್ಮ ಬಗ್ಗೆ',
        heading: 'ಬೆಳೆ ಒತ್ತಡ ಹರಡುವ ಮುನ್ನವೇ ಪ್ರತಿ ರೈತರಿಗೆ ಸ್ಪಷ್ಟ ಮಾಹಿತಿ ನೀಡಲು ನಿರ್ಮಿಸಲಾಗಿದೆ.',
        paragraph1:
          'CropSense ಭಾರತೀಯ ಕೃಷಿಗಾಗಿ ಎಐ-ಆಧಾರಿತ ಎಲೆ ರೋಗ ಪತ್ತೆ, ಧ್ವನಿ-ಸಹಿತ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಐತಿಹಾಸಿಕ ಜಮೀನು ವಿಶ್ಲೇಷಣೆಯನ್ನು ಒಂದೇ ಸರಳ ವೇದಿಕೆಯಲ್ಲಿ ಒದಗಿಸುತ್ತದೆ.',
        paragraph2:
          'ನಿಮ್ಮ ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ವಿಸ್ತೀರ್ಣ, ಬೆಳೆ ಮತ್ತು ಋತುವಿನ ವಿವರಗಳನ್ನು ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ಮರಾಠಿ ಮತ್ತು ಕನ್ನಡದ ತ್ವರಿತ ವಿಶ್ಲೇಷಣೆಯೊಂದಿಗೆ ಸಂಯೋಜಿಸಿ, CropSense ಇಳುವರಿಯನ್ನು ರಕ್ಷಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
        pillar1Title: 'ಮುಂಚಿತ ರೋಗ ಪತ್ತೆ',
        pillar1Desc:
          'ಪ್ರಾಥಮಿಕ ರೋಗ ಪತ್ತೆ, ತೀವ್ರತೆ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳಿಗಾಗಿ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಅಥವಾ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.',
        pillar2Title: 'ಬಹುಭಾಷಾ ಮತ್ತು ಧ್ವನಿ ಸಹಾಯ',
        pillar2Desc:
          'ನಿಮ್ಮ ಉಳಿಸಿದ ಜಮೀನಿನ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ಮರಾಠಿ ಮತ್ತು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ.',
        pillar3Title: '5-ವರ್ಷಗಳ ಜಮೀನು ವಿಶ್ಲೇಷಣೆ',
        pillar3Desc:
          'ಋತುಮಾನದ ಮಾದರಿಗಳನ್ನು ಹೋಲಿಸಿ, ಪರಿಸರ ಬದಲಾವಣೆಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತು ಪಿಡಿಎಫ್ ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
        startCta: 'ಈಗ CropSense ಪ್ರಯತ್ನಿಸಿ',
        chatbotCta: 'ಎಐ ಸಹಾಯಕ ತೆರೆಯಿರಿ',
        footerTagline: 'ಪ್ರತಿ ಕೊಯ್ಲಿಗೂ ಮುಂಚಿತ ಬೆಳೆ ಆರೋಗ್ಯ ಬುದ್ಧಿವಂತಿಕೆ.',
      },
    },
    dashboard: {
      farmDetailsTitle: 'ಜಮೀನಿನ ವಿವರಗಳು',
      farmDetailsSubtitle: 'ನಿಖರ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಜಮೀನಿನ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ.',
      locationGroup: 'ಸ್ಥಳ',
      farmInfoGroup: 'ಜಮೀನಿನ ಮಾಹಿತಿ',
      stateLabel: 'ರಾಜ್ಯ',
      cityLabel: 'ನಗರ / ಜಿಲ್ಲೆ',
      cityPlaceholder: 'ನಗರ ಹುಡುಕಿ ಅಥವಾ ನಮೂದಿಸಿ',
      latitudeLabel: 'ಅಕ್ಷಾಂಶ (Latitude)',
      latitudePlaceholder: 'ಉದಾ. 20.9320',
      longitudeLabel: 'ರೇಖಾಂಶ (Longitude)',
      longitudePlaceholder: 'ಉದಾ. 77.7523',
      optionalTag: 'ಐಚ್ಛಿಕ',
      requiredTag: 'ಕಡ್ಡಾಯ',
      locationOrCoordsHint: 'ರಾಜ್ಯ ಮತ್ತು ನಗರವನ್ನು ನಮೂದಿಸಿ, ಅಥವಾ ನಿಖರ ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶ ನೀಡಿ.',
      farmSizeLabel: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ',
      farmSizePlaceholder: 'ವಿಸ್ತೀರ್ಣ ನಮೂದಿಸಿ',
      cropLabel: 'ಬೆಳೆ',
      cropSearchPlaceholder: 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ',
      seasonLabel: 'ಋತು (ಹಂಗಾಮು)',
      yieldLabel: 'ಕಳೆದ ವರ್ಷದ ಇಳುವರಿ ಮೌಲ್ಯ (₹)',
      yieldPlaceholder: 'ಉದಾ. 125000',
      saveButton: 'ಜಮೀನಿನ ವಿವರ ಉಳಿಸಿ',
      savedSuccess: 'ಜಮೀನಿನ ವಿವರಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ. AI ಸಹಾಯಕ ಮತ್ತು ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ ನವೀಕರಿಸಲಾಗಿದೆ.',
      editHint: 'ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಜಮೀನಿನ ವಿವರಗಳನ್ನು ಬದಲಾಯಿಸಬಹುದು.',
      intelligenceKicker: 'ಕೃಷಿ ಬುದ್ಧಿಮತ್ತೆ',
      intelligenceHeadline: 'ನಿಮ್ಮ ಬೆಳೆ ಆರೋಗ್ಯ, AI ನಿಂದ ಶಕ್ತಿಶಾಲಿ',
      intelligenceDescription:
        'ರೋಗಗಳನ್ನು ಬೇಗ ಪತ್ತೆಹಚ್ಚಿ, ಅಪಾಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಉತ್ತಮ ಇಳುವರಿಗಾಗಿ ವೈಯಕ್ತಿಕ ಸಲಹೆ ಪಡೆಯಿರಿ.',
      chatbotCardTitle: 'AI ಚಾಟ್‌ಬಾಟ್ ಮತ್ತು ರೋಗ ವಿಶ್ಲೇಷಣೆ',
      chatbotCardDescription:
        'ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ಸಸ್ಯದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ರೋಗ ಪತ್ತೆ, ಅಪಾಯ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಸಲಹೆ ಪಡೆಯಿರಿ.',
      chatbotCardAction: 'AI ಚಾಟ್‌ಬಾಟ್ ತೆರೆಯಿರಿ',
      historicalCardTitle: 'ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ',
      historicalCardDescription:
        'ಐದು ವರ್ಷಗಳ ಉಪಗ್ರಹ ಡೇಟಾವನ್ನು ಅನ್ವೇಷಿಸಿ, ಜಮೀನಿನ ಬದಲಾವಣೆಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತು ವಿವರವಾದ ವರದಿ ರಚಿಸಿ.',
      historicalCardAction: 'ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ ತೆರೆಯಿರಿ',
      validation: {
        locationOrCoordsRequired: 'ದಯವಿಟ್ಟು ರಾಜ್ಯ ಮತ್ತು ನಗರ, ಅಥವಾ ಮಾನ್ಯ ಅಕ್ಷಾಂಶ ಮತ್ತು ರೇಖಾಂಶ ನಮೂದಿಸಿ.',
        invalidLatitude: 'ಅಕ್ಷಾಂಶವು -90 ಮತ್ತು 90 ರ ನಡುವಿನ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು.',
        invalidLongitude: 'ರೇಖಾಂಶವು -180 ಮತ್ತು 180 ರ ನಡುವಿನ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು.',
        invalidFarmSize: 'ದಯವಿಟ್ಟು 0 ಗಿಂತ ಹೆಚ್ಚಿನ ಮಾನ್ಯ ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣವನ್ನು ನಮೂದಿಸಿ.',
        cropRequired: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮುಖ್ಯ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        seasonRequired: 'ದಯವಿಟ್ಟು ಬೆಳೆ ಋತುವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        invalidYield: 'ದಯವಿಟ್ಟು ರೂಪಾಯಿಗಳಲ್ಲಿ ಮಾನ್ಯ ಇಳುವರಿ ಮೌಲ್ಯವನ್ನು ನಮೂದಿಸಿ.',
      },
    },
    options: {
      units: {
        Acres: 'ಎಕರೆ',
        Hectares: 'ಹೆಕ್ಟೇರ್',
        'Square Metres': 'ಚದರ ಮೀಟರ್',
      },
      crops: {
        Cotton: 'ಹತ್ತಿ',
        Wheat: 'ಗೋಧಿ',
        Rice: 'ಭತ್ತ (ಅಕ್ಕಿ)',
        Soybean: 'ಸೋಯಾಬೀನ್',
        Maize: 'ಮೆಕ್ಕೆಜೋಳ',
        Sugarcane: 'ಕಬ್ಬು',
        Tomato: 'ಟೊಮ್ಯಾಟೊ',
        Onion: 'ಈರುಳ್ಳಿ',
        Other: 'ಇತರೆ',
      },
      seasons: {
        Kharif: 'ಮುಂಗಾರು (ಖರೀಫ್)',
        Rabi: 'ಹಿಂಗಾರು (ರಬಿ)',
        Zaid: 'ಬೇಸಿಗೆ (ಝೈದ್)',
      },
      severities: {
        Low: 'ಕಡಿಮೆ',
        Moderate: 'ಮಧ್ಯಮ',
        High: 'ಹೆಚ್ಚು',
        Critical: 'ಗಂಭೀರ',
      },
      statuses: {
        Completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
        Demonstration: 'ಪ್ರದರ್ಶನ',
        'Awaiting Satellite Provider': 'ಉಪಗ್ರಹ ಡೇಟಾ ಪೂರೈಕೆದಾರರ ನಿರೀಕ್ಷೆಯಲ್ಲಿ',
      },
    },
    chatbot: {
      title: 'AI ಬೆಳೆ ಆರೋಗ್ಯ ಸಹಾಯಕ',
      subtitle: 'ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ಕೃಷಿ ಸಂಗಾತಿ.',
      editFarmLink: 'ಜಮೀನಿನ ವಿವರ ಬದಲಿಸಿ',
      welcomeMessage:
        'CropSense ಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಬೆಳೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ, ಪ್ರಾಥಮಿಕ ರೋಗ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಎಲೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ತ್ವರಿತ ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಿ.',
      inputPlaceholder: 'ನಿಮ್ಮ ಬೆಳೆಯ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...',
      sendButton: 'ಕಳುಹಿಸಿ',
      uploadImageAria: 'ಸಸ್ಯ ಅಥವಾ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      removeImageAria: 'ಫೋಟೋ ತೆಗೆದುಹಾಕಿ',
      voiceStartAria: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ',
      voiceStopAria: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ನಿಲ್ಲಿಸಿ',
      listeningLabel: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...',
      speakAria: 'ಉತ್ತರವನ್ನು ಕೇಳಿ',
      stopSpeakingAria: 'ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
      clearChatButton: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',
      analyzingLabel: 'ಬೆಳೆ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      analyzingImageLabel: 'ಸಸ್ಯದ ಫೋಟೋವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      imageReadyLabel: 'ಎಲೆಯ ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ — ವಿಶ್ಲೇಷಣೆಗೆ ಸಿದ್ಧ',
      quickActionsLabel: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
      quickActions: {
        detectDisease: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆಹಚ್ಚಿ',
        checkRisk: 'ರೋಗ ಅಪಾಯ ಪರಿಶೀಲಿಸಿ',
        preventiveMeasures: 'ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳನ್ನು ಸೂಚಿಸಿ',
        recommendTreatment: 'ಚಿಕಿತ್ಸೆ ಶಿಫಾರಸು ಮಾಡಿ',
        environmentalConditions: 'ಪರಿಸರ ಸ್ಥಿತಿ ವಿಶ್ಲೇಷಿಸಿ',
      },
      quickActionPrompts: {
        detectDisease: 'ನನ್ನ ಬೆಳೆಯಲ್ಲಿ ಶಿಲೀಂಧ್ರ ಅಥವಾ ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗಗಳನ್ನು ಬೇಗ ಗುರುತಿಸಲು ಎಲೆಗಳಲ್ಲಿ ಯಾವ ಆರಂಭಿಕ ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಬೇಕು?',
        checkRisk: 'ನನ್ನ ಉಳಿಸಿದ ಬೆಳೆ, ಸ್ಥಳ ಮತ್ತು ಋತುವಿನ ಆಧಾರದ ಮೇಲೆ ಈ ತಿಂಗಳು ಯಾವ ಪ್ರಮುಖ ರೋಗದ ಅಪಾಯಗಳಿವೆ?',
        preventiveMeasures: 'ಋತುಮಾನದ ಬ್ಲೈಟ್, ಸೊರಗು ರೋಗ ಮತ್ತು ಕೀಟಗಳಿಂದ ನನ್ನ ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸಲು ಪ್ರಾಯೋಗಿಕ ತಡೆಗಟ್ಟುವ ವೇಳಾಪಟ್ಟಿ ಸೂಚಿಸಿ.',
        recommendTreatment: 'ಹೊಲದಲ್ಲಿ ಎಲೆ ಚುಕ್ಕೆ ಅಥವಾ ಬ್ಲೈಟ್ ಕಾಣಿಸಿಕೊಂಡರೆ ಸಮಗ್ರ ರೋಗ ನಿರ್ವಹಣೆಗೆ ಯಾವ ಕ್ರಮಗಳನ್ನು ಅನುಸರಿಸಬೇಕು?',
        environmentalConditions: 'ಋತುಮಾನದ ತೇವಾಂಶ, ಮಳೆ ಮತ್ತು ತಾಪಮಾನ ಬದಲಾವಣೆಗಳು ನನ್ನ ಬೆಳೆಯ ರೋಗ ಒತ್ತಡದ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತವೆ?',
      },
      diseaseCard: {
        diseaseIdentified: 'ಪತ್ತೆಯಾದ ರೋಗ',
        confidence: 'ವಿಶ್ವಾಸ ಮಟ್ಟ',
        severity: 'ತೀವ್ರತೆ',
        riskLevel: 'ಅಪಾಯದ ಮಟ್ಟ',
        visibleSymptoms: 'ಕಾಣಿಸುವ ಲಕ್ಷಣಗಳು',
        potentialCauses: 'ಸಂಭಾವ್ಯ ಕಾರಣಗಳು',
        preventiveMeasures: 'ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು',
        suggestedTreatment: 'ಸೂಚಿಸಿದ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಮುಂದಿನ ಹಂತಗಳು',
        whenToSeekExpert: 'ಕೃಷಿ ತಜ್ಞರನ್ನು ಯಾವಾಗ ಸಂಪರ್ಕಿಸಬೇಕು',
        demoNotice: 'ಪ್ರದರ್ಶನ ಮೋಡ್ — AI ವಿಷನ್ ಬ್ಯಾಕೆಂಡ್ ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ. ಇದನ್ನು ನಿಜವಾದ ವೈದ್ಯಕೀಯ ನಿರ್ಣಯವೆಂದು ಪರಿಗಣಿಸಬೇಡಿ.',
        saveReportButton: 'ವರದಿಗಳಲ್ಲಿ ಉಳಿಸಿ',
        reportSavedButton: 'ವರದಿಗಳಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ',
        defaultDisclaimer:
          'ಇದು ಚಿತ್ರ ಆಧಾರಿತ ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ ಮಾತ್ರ. ಯಾವುದೇ ಕೀಟನಾಶಕ ಅಥವಾ ರಾಸಾಯನಿಕ ಚಿಕಿತ್ಸೆಯ ಮೊದಲು ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ದೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ.',
      },
      voiceErrors: {
        unsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.',
        permissionDenied: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ.',
        generic: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        ttsUnsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಓದುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.',
      },
      errors: {
        invalidImageType: 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಚಿತ್ರ ಫೈಲ್ (JPG, PNG ಅಥವಾ WebP) ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
        imageTooLarge: 'ಚಿತ್ರವು 8 MB ಗಿಂತ ಚಿಕ್ಕದಾಗಿರಬೇಕು.',
        requestFailed: 'ಈಗ AI ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
        demoFallbackBanner: 'ಸರ್ವರ್‌ನಲ್ಲಿ AI ಕೀ ಕಾನ್ಫಿಗರ್ ಆಗಿಲ್ಲ; ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಲಾದ ಪ್ರದರ್ಶನ ಫಲಿತಾಂಶ ತೋರಿಸಲಾಗಿದೆ.',
      },
    },
    historical: {
      title: 'ಐತಿಹಾಸಿಕ ಬೆಳೆ ವಿಶ್ಲೇಷಣೆ',
      subtitle: 'ಕಾಲಾನಂತರದಲ್ಲಿ ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿ ಹೇಗೆ ಬದಲಾಗಿದೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ.',
      farmContextTitle: 'ಉಳಿಸಿದ ಜಮೀನು ಮಾಹಿತಿ',
      editOnDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ ಬದಲಿಸಿ',
      coordinatesNotSet: 'ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ನಮೂದಿಸಿಲ್ಲ',
      configTitle: 'ವಿಶ್ಲೇಷಣೆ ಸಂರಚನೆ',
      yearRangeLabel: 'ವರ್ಷಗಳ ಅವಧಿ',
      lastFiveYears: 'ಕಳೆದ 5 ವರ್ಷಗಳು (2022–2026)',
      seasonLabel: 'ಋತು',
      parametersLabel: 'ವಿಶ್ಲೇಷಣಾ ಅಂಶಗಳು',
      generateButton: 'ವಿಶ್ಲೇಷಣೆ ವರದಿ ರಚಿಸಿ',
      generatingButton: 'ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
      reportQueuedMessage:
        'ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣಾ ವಿನಂತಿಯನ್ನು ವರದಿಗಳಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದೆ. ಉಪಗ್ರಹ ಪೂರೈಕೆದಾರರು ಸಂಪರ್ಕಗೊಂಡಾಗ ಲೈವ್ ಡೇಟಾ ಲಭ್ಯವಾಗುತ್ತದೆ.',
      parameters: {
        vegetationHealth: 'ಸಸ್ಯ ಆರೋಗ್ಯ',
        vegetationIndex: 'ಸಸ್ಯ ಸೂಚ್ಯಂಕ ಪ್ರವೃತ್ತಿಗಳು',
        cropCoverage: 'ಬೆಳೆ ವ್ಯಾಪ್ತಿ',
        waterAvailability: 'ನೀರಿನ ಲಭ್ಯತೆ',
        soilCondition: 'ಮಣ್ಣು ಮತ್ತು ಭೂಮಿ ಸ್ಥಿತಿ ಸೂಚಕಗಳು',
        environmentalTrends: 'ಪರಿಸರ ಪ್ರವೃತ್ತಿಗಳು',
      },
      comingSoonBannerTitle: 'ಐತಿಹಾಸಿಕ ಉಪಗ್ರಹ ವಿಶ್ಲೇಷಣೆ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ.',
      comingSoonBannerBody:
        'Sentinel-2, Landsat ಅಥವಾ Google Earth Engine ನಂತಹ ನೇರ ಉಪಗ್ರಹ ಡೇಟಾ ಪೂರೈಕೆದಾರರನ್ನು ಸಂಪರ್ಕಿಸಿದ ನಂತರ ಐದು ವರ್ಷಗಳ ದೃಢೀಕೃತ ಚಿತ್ರಗಳು ಮತ್ತು ವರದಿಗಳು ಲಭ್ಯವಾಗುತ್ತವೆ.',
      satellitePanelTitle: 'ಉಪಗ್ರಹ ಚಿತ್ರ ವೀಕ್ಷಕ',
      satelliteCompareToggle: 'ಪಕ್ಕಪಕ್ಕದ ಹೋಲಿಕೆ',
      primaryYearLabel: 'ಮುಖ್ಯ ವರ್ಷ',
      compareYearLabel: 'ಹೋಲಿಕೆ ವರ್ಷ',
      satelliteComingSoonTitle: 'ಐತಿಹಾಸಿಕ ಉಪಗ್ರಹ ವಿಶ್ಲೇಷಣೆ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ.',
      satelliteComingSoonBody:
        'ಈ ಜಮೀನಿಗೆ ಇನ್ನೂ ಯಾವುದೇ ದೃಢೀಕೃತ ಉಪಗ್ರಹ ಚಿತ್ರಗಳು ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ. ಪೂರೈಕೆದಾರರನ್ನು ಜೋಡಿಸಿದ ನಂತರ ನೀವು ಐದು ವರ್ಷಗಳ ಹೋಲಿಕೆ ನೋಡಬಹುದು.',
      satelliteProviderNote: 'ಸಂಪರ್ಕಕ್ಕೆ ಸಿದ್ಧ ಪೂರೈಕೆದಾರರು: Sentinel-2 · Landsat · Google Earth Engine',
      satelliteForYear: 'ಉಪಗ್ರಹ ಚಿತ್ರ —',
      comingSoonShort: 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ',
      chartsSectionTitle: 'ಐದು ವರ್ಷಗಳ ಚಾರ್ಟ್ ಕಾರ್ಯಕ್ಷೇತ್ರ',
      chartsPreviewNotice:
        'ಕೇವಲ ಚಾರ್ಟ್ ರಚನೆಯ ಮಾದರಿ — ನೇರ ಉಪಗ್ರಹ ಪೂರೈಕೆದಾರರ ಸಂಪರ್ಕದ ನಿರೀಕ್ಷೆಯಲ್ಲಿದೆ. ಇವು ನಿಮ್ಮ ಜಮೀನಿನ ದೃಢೀಕೃತ ಅಳತೆಗಳಲ್ಲ.',
      chartTitles: {
        vegetationHealth: 'ಸಸ್ಯ ಆರೋಗ್ಯ ಪ್ರವೃತ್ತಿ (NDVI)',
        seasonalIndex: 'ಋತುಮಾನದ ಸಸ್ಯ ಸೂಚ್ಯಂಕ',
        environmentalTrends: 'ಪರಿಸರ ಅಂಶಗಳ ಪ್ರವೃತ್ತಿ',
        cropHealthComparison: 'ಬೆಳೆ ಆರೋಗ್ಯ ಮತ್ತು ವ್ಯಾಪ್ತಿ ಹೋಲಿಕೆ',
        fiveYearChange: 'ಐದು ವರ್ಷಗಳ ಐತಿಹಾಸಿಕ ಬದಲಾವಣೆ ಸಾರಾಂಶ',
      },
      chartLabels: {
        ndvi: 'NDVI ಸೂಚ್ಯಂಕ',
        healthScore: 'ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ',
        rainfallMm: 'ಮಳೆ (ಮಿಮೀ)',
        soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ (%)',
        cropCoverage: 'ಬೆಳೆ ವ್ಯಾಪ್ತಿ (%)',
        avgTemp: 'ಸರಾಸರಿ ತಾಪಮಾನ (°C)',
      },
    },
    reports: {
      title: 'ಬೆಳೆ ಆರೋಗ್ಯ ವರದಿಗಳು',
      subtitle: 'ನಿಮ್ಮ ಹಿಂದಿನ ಬೆಳೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆಗಳು ಮತ್ತು ಶಿಫಾರಸುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      filterAll: 'ಎಲ್ಲಾ ವರದಿಗಳು',
      filterDisease: 'ರೋಗ ವಿಶ್ಲೇಷಣೆ',
      filterHistorical: 'ಐತಿಹಾಸಿಕ ವರದಿಗಳು',
      searchPlaceholder: 'ಬೆಳೆ, ಸ್ಥಳ ಅಥವಾ ಫಲಿತಾಂಶ ಹುಡುಕಿ...',
      emptyTitle: 'ಇನ್ನೂ ಯಾವುದೇ ಬೆಳೆ ಆರೋಗ್ಯ ವರದಿಗಳಿಲ್ಲ',
      emptyDescription:
        'ಇಲ್ಲಿ ವರದಿಗಳನ್ನು ಉಳಿಸಲು AI ಸಹಾಯಕದಲ್ಲಿ ಸಸ್ಯ ರೋಗ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ ಅಥವಾ ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ ವಿನಂತಿಯನ್ನು ರಚಿಸಿ.',
      startAnalysisCta: 'ರೋಗ ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ',
      goToHistoricalCta: 'ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ ತೆರೆಯಿರಿ',
      createdOn: 'ದಿನಾಂಕ',
      cropLabel: 'ಬೆಳೆ',
      locationLabel: 'ಸ್ಥಳ',
      findingLabel: 'ಫಲಿತಾಂಶ',
      severityLabel: 'ತೀವ್ರತೆ',
      statusLabel: 'ಸ್ಥಿತಿ',
      viewReport: 'ವರದಿ ನೋಡಿ',
      viewRecommendations: 'ಶಿಫಾರಸುಗಳನ್ನು ನೋಡಿ',
      downloadPdf: 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
      deleteReport: 'ವರದಿ ಅಳಿಸಿ',
      typeDisease: 'ರೋಗ ವಿಶ್ಲೇಷಣೆ',
      typeHistorical: 'ಐತಿಹಾಸಿಕ ವಿಶ್ಲೇಷಣೆ',
      modalClose: 'ಮುಚ್ಚಿ',
      modalSummaryTitle: 'ವಿಶ್ಲೇಷಣೆ ಸಾರಾಂಶ',
      modalRecommendationsTitle: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು',
      modalSymptomsTitle: 'ಕಾಣಿಸುವ ಲಕ್ಷಣಗಳು',
      modalCausesTitle: 'ಸಂಭಾವ್ಯ ಕಾರಣಗಳು',
      modalPreventiveTitle: 'ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು',
      modalExpertTitle: 'ತಜ್ಞರ ಸಲಹೆ ಯಾವಾಗ ಪಡೆಯಬೇಕು',
      pdfSuccessToast: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ.',
    },
  },
};
