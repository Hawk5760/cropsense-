import type { LanguageCode } from '../types/cropsense';

export interface DashboardExtendedTranslations {
  tabs: {
    chatbot: string;
    chatbotShort: string;
    cropHealth: string;
    cropHealthShort: string;
    lossOptimisation: string;
    lossOptimisationShort: string;
    information: string;
    informationShort: string;
  };
  voiceAutoFill: {
    title: string;
    subtitle: string;
    startButton: string;
    stopButton: string;
    listeningStatus: string;
    extractingStatus: string;
    reviewBanner: string;
    examplePrompt: string;
    unsupportedError: string;
    failedError: string;
    transcriptLabel: string;
  };
  weather: {
    title: string;
    subtitle: string;
    refreshButton: string;
    loading: string;
    error: string;
    submitPrompt: string;
    currentHeading: string;
    temperature: string;
    feelsLike: string;
    humidity: string;
    rainfall: string;
    windSpeed: string;
    past30DaysTitle: string;
    tempToggle: string;
    rainToggle: string;
    forecast7DayTitle: string;
    sourceLabel: string;
    rainChance: string;
  };
  cropHealth: {
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadSubtitle: string;
    dateLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    photoLabel: string;
    choosePhoto: string;
    changePhoto: string;
    analyzeButton: string;
    analyzingButton: string;
    illustrativeNotice: string;
    clearDemoButton: string;
    kpiHealthScore: string;
    kpiOutbreakProb: string;
    kpiIrrigation: string;
    kpiStressStatus: string;
    trendChartTitle: string;
    timelineTitle: string;
    galleryTitle: string;
    explanationLabel: string;
    actionsLabel: string;
    riskLabels: {
      green: string;
      yellow: string;
      red: string;
    };
    irrigationLabels: {
      Insufficient: string;
      Optimal: string;
      Excessive: string;
    };
    emptyTitle: string;
    emptyBody: string;
  };
  lossOptimisation: {
    title: string;
    subtitle: string;
    inputsTitle: string;
    lastYearYieldLabel: string;
    currentYearYieldLabel: string;
    estimatedLossLabel: string;
    estimatedLossHint: string;
    calculateButton: string;
    yoyChartTitle: string;
    lossBreakdownTitle: string;
    kpiTotalLoss: string;
    kpiRecoverable: string;
    kpiRemainingGap: string;
    kpiYoyChange: string;
    strategiesTitle: string;
    strategiesDisclaimer: string;
    estimatedRecoveryLabel: string;
    benefitsHeading: string;
    eligibilityHeading: string;
    stepsHeading: string;
    strategyTitles: {
      carbon_credit: string;
      composting: string;
      cattle_feed: string;
      waste_monetization: string;
      compensation: string;
    };
    feasibilityLabels: {
      High: string;
      Medium: string;
      Conditional: string;
    };
    noLossTitle: string;
    noLossBody: string;
    askSchemesCta: string;
  };
  information: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    onlyMyFarmToggle: string;
    matchedBadge: string;
    allIndiaBadge: string;
    benefitsHeading: string;
    eligibilityHeading: string;
    documentsHeading: string;
    deadlineHeading: string;
    applyButton: string;
    askAiAboutScheme: string;
    emptyTitle: string;
    emptyBody: string;
    categories: {
      Insurance: string;
      'Central & State Schemes': string;
      Subsidies: string;
      'NGO Grants': string;
      Compensation: string;
    };
  };
  floatingChatbot: {
    generalLabel: string;
    financialLabel: string;
    financialTooltip: string;
    financialBannerTitle: string;
    financialBannerBody: string;
    switchToGeneral: string;
    financialPrompts: {
      eligibleSchemes: string;
      cropLossClaim: string;
      microIrrigationSubsidy: string;
      documentsChecklist: string;
    };
  };
}

export const dashboardTranslations: Record<LanguageCode, DashboardExtendedTranslations> = {
  en: {
    tabs: {
      chatbot: 'AI Chatbot',
      chatbotShort: 'AI Chatbot',
      cropHealth: 'Crop Health Monitoring',
      cropHealthShort: 'Crop Health',
      lossOptimisation: 'Loss Optimisation',
      lossOptimisationShort: 'Loss Recovery',
      information: 'Information & Financial Assistance',
      informationShort: 'Schemes & Aid',
    },
    voiceAutoFill: {
      title: 'Voice Auto-Fill',
      subtitle: 'Speak your location, farm size, crop, season & last year yield',
      startButton: 'Speak Farm Details',
      stopButton: 'Stop Listening',
      listeningStatus: 'Listening… speak naturally in your selected language',
      extractingStatus: 'Extracting farm details…',
      reviewBanner:
        'Farm details auto-filled from voice. Please review or edit fields below, then click Save.',
      examplePrompt: 'e.g., "5 acres Cotton in Amravati Maharashtra, Kharif season, last year 125000 rupees"',
      unsupportedError: 'Voice recognition is not supported in this browser. Please enter fields manually.',
      failedError: 'Could not extract details from speech. Please try again or edit manually.',
      transcriptLabel: 'Heard:',
    },
    weather: {
      title: 'Weather Monitoring',
      subtitle: 'Live conditions, 30-day history & 7-day forecast',
      refreshButton: 'Refresh',
      loading: 'Fetching weather data for your farm…',
      error: 'Unable to load weather right now. Try refreshing.',
      submitPrompt: 'Save farm details above to automatically load location-specific weather.',
      currentHeading: 'Current Conditions',
      temperature: 'Temp',
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      rainfall: 'Rainfall',
      windSpeed: 'Wind',
      past30DaysTitle: 'Past 30 Days Weather',
      tempToggle: 'Temp (°C)',
      rainToggle: 'Rain (mm)',
      forecast7DayTitle: 'Upcoming 7-Day Forecast',
      sourceLabel: 'Source',
      rainChance: 'Rain',
    },
    cropHealth: {
      title: 'Crop Health Monitoring',
      subtitle: 'Upload weekly farm or plant photos to track health trends, disease risk, and irrigation balance.',
      uploadTitle: 'Weekly Field Photo Upload',
      uploadSubtitle: 'Log a dated photo each week to build your season-long health timeline.',
      dateLabel: 'Observation Date',
      notesLabel: 'Field Notes (Optional)',
      notesPlaceholder: 'e.g., Lower leaves yellowing after rain, irrigation ran 2 hours…',
      photoLabel: 'Farm / Plant Photo',
      choosePhoto: 'Upload Weekly Photo',
      changePhoto: 'Change Photo',
      analyzeButton: 'Analyze & Add to Timeline',
      analyzingButton: 'Analyzing Weekly Photo…',
      illustrativeNotice:
        'Sample 4-week timeline shown for demonstration. Upload your own weekly crop photo to log live AI analysis.',
      clearDemoButton: 'Start Fresh',
      kpiHealthScore: 'Crop Health Score',
      kpiOutbreakProb: 'Outbreak Probability',
      kpiIrrigation: 'Irrigation Signal',
      kpiStressStatus: 'Crop Stress Level',
      trendChartTitle: 'Weekly Health & Outbreak Trend',
      timelineTitle: 'Crop Health Timeline & Recommendations',
      galleryTitle: 'Date-Wise Image History',
      explanationLabel: 'Assessment Explanation',
      actionsLabel: 'Recommended Actionable Steps',
      riskLabels: {
        green: 'Low Risk (Healthy)',
        yellow: 'Moderate Risk (Watch)',
        red: 'High Risk (Action Needed)',
      },
      irrigationLabels: {
        Insufficient: 'Insufficient Watering',
        Optimal: 'Optimal Moisture',
        Excessive: 'Excessive Watering',
      },
      emptyTitle: 'No weekly crop observations logged yet',
      emptyBody: 'Upload your first weekly field or leaf image above to start tracking health progression.',
    },
    lossOptimisation: {
      title: 'Loss Optimisation & Revenue Recovery',
      subtitle: 'Compare year-over-year yield value and uncover practical recovery pathways for crop losses.',
      inputsTitle: 'Yield & Loss Inputs',
      lastYearYieldLabel: "Last Year's Yield Value (₹)",
      currentYearYieldLabel: "Current Year's Yield Value (₹)",
      estimatedLossLabel: 'Estimated Financial Loss (₹)',
      estimatedLossHint: 'Auto-computed from yield drop or enter your own verified loss estimate',
      calculateButton: 'Calculate & Analyse',
      yoyChartTitle: 'Year-over-Year Yield Comparison (₹)',
      lossBreakdownTitle: 'Loss Recovery Breakdown (₹)',
      kpiTotalLoss: 'Estimated Financial Loss',
      kpiRecoverable: 'Estimated Recoverable',
      kpiRemainingGap: 'Remaining Loss Gap',
      kpiYoyChange: 'YoY Yield Change',
      strategiesTitle: 'Actionable Recovery & Alternative Revenue Strategies',
      strategiesDisclaimer:
        'Illustrative estimates based on your saved farm acreage, crop, and Indian benchmark ranges. Verify exact payouts with local FPOs, buyers, or scheme portals.',
      estimatedRecoveryLabel: 'Est. Potential Recovery',
      benefitsHeading: 'Potential Benefits',
      eligibilityHeading: 'Eligibility & Safety Notes',
      stepsHeading: 'Actionable Steps',
      strategyTitles: {
        carbon_credit: 'Agricultural Carbon Credit Programmes',
        composting: 'Composting & Organic Fertilizers from Suitable Spoiled Crops',
        cattle_feed: 'Selling Safe Crop Residues as Cattle Feed',
        waste_monetization: 'Agricultural Waste Monetization (Pellets, Biochar & Mulch)',
        compensation: 'Eligible Compensation & Financial Assistance',
      },
      feasibilityLabels: {
        High: 'High Fit',
        Medium: 'Medium Fit',
        Conditional: 'Conditional',
      },
      noLossTitle: 'No net yield loss detected for the entered values',
      noLossBody:
        'Your current year yield meets or exceeds last year. You can still explore supplementary revenue pathways below or enter a specific estimated loss amount.',
      askSchemesCta: 'Explore Eligible Schemes',
    },
    information: {
      title: 'Information & Financial Assistance',
      subtitle:
        'Centralized directory of agricultural insurance, central & state schemes, subsidies, NGO grants, and calamity compensation.',
      searchPlaceholder: 'Search schemes by name, benefit, state, or crop…',
      allCategories: 'All Programmes',
      onlyMyFarmToggle: 'Match My Farm Profile',
      matchedBadge: 'Matches Your Farm',
      allIndiaBadge: 'All India',
      benefitsHeading: 'Key Benefits',
      eligibilityHeading: 'Eligibility Criteria',
      documentsHeading: 'Required Documents',
      deadlineHeading: 'Application Window / Deadline',
      applyButton: 'Official Portal',
      askAiAboutScheme: 'Ask AI About Eligibility',
      emptyTitle: 'No matching programmes found',
      emptyBody: 'Try clearing your search term or switching to All Programmes.',
      categories: {
        Insurance: 'Insurance',
        'Central & State Schemes': 'Central & State',
        Subsidies: 'Subsidies',
        'NGO Grants': 'NGO Grants',
        Compensation: 'Compensation',
      },
    },
    floatingChatbot: {
      generalLabel: 'Ask AI Chatbot',
      financialLabel: 'Ask Scheme Assistant',
      financialTooltip: 'Get help finding financial schemes matched to your farm',
      financialBannerTitle: 'Financial Assistance Context Active',
      financialBannerBody:
        'AI Chatbot is tuned to help you identify eligible crop insurance, subsidies, NGO grants, and compensation based on your saved farm profile.',
      switchToGeneral: 'Switch to General Crop Mode',
      financialPrompts: {
        eligibleSchemes: 'Which government schemes and subsidies fit my saved farm details?',
        cropLossClaim: 'How do I claim PMFBY or SDRF crop loss compensation step-by-step?',
        microIrrigationSubsidy: 'What drip/sprinkler irrigation subsidy am I eligible for in my state?',
        documentsChecklist: 'List the exact documents I need to apply for crop insurance and relief.',
      },
    },
  },
  hi: {
    tabs: {
      chatbot: 'AI चैटबॉट',
      chatbotShort: 'AI चैटबॉट',
      cropHealth: 'फसल स्वास्थ्य निगरानी',
      cropHealthShort: 'फसल स्वास्थ्य',
      lossOptimisation: 'नुकसान अनुकूलन',
      lossOptimisationShort: 'नुकसान सुधार',
      information: 'जानकारी और वित्तीय सहायता',
      informationShort: 'योजनाएं और सहायता',
    },
    voiceAutoFill: {
      title: 'आवाज़ से ऑटो-फ़िल',
      subtitle: 'अपना स्थान, खेत का आकार, फसल, मौसम और पिछले वर्ष की आय बोलें',
      startButton: 'खेत का विवरण बोलें',
      stopButton: 'सुनना बंद करें',
      listeningStatus: 'सुन रहा है… अपनी चुनी हुई भाषा में स्वाभाविक रूप से बोलें',
      extractingStatus: 'खेत का विवरण निकाला जा रहा है…',
      reviewBanner:
        'आवाज़ से विवरण भर दिया गया है। कृपया नीचे जांचें या संपादित करें, फिर सेव करें।',
      examplePrompt: 'उदा., "महाराष्ट्र अमरावती में 5 एकड़ कपास, खरीफ मौसम, पिछले साल 125000 रुपये"',
      unsupportedError: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया मैन्युअल रूप से भरें।',
      failedError: 'आवाज़ से विवरण नहीं पढ़ा जा सका। कृपया दोबारा बोलें या मैन्युअल रूप से भरें।',
      transcriptLabel: 'सुना गया:',
    },
    weather: {
      title: 'मौसम निगरानी',
      subtitle: 'ताज़ा मौसम, पिछले 30 दिन का रिकॉर्ड और 7-दिन का पूर्वानुमान',
      refreshButton: 'रिफ्रेश',
      loading: 'आपके खेत का मौसम डेटा लोड हो रहा है…',
      error: 'अभी मौसम लोड नहीं हो सका। कृपया रिफ्रेश करें।',
      submitPrompt: 'अपने स्थान का मौसम देखने के लिए ऊपर खेत का विवरण सेव करें।',
      currentHeading: 'वर्तमान मौसम',
      temperature: 'तापमान',
      feelsLike: 'महसूस',
      humidity: 'नमी',
      rainfall: 'वर्षा',
      windSpeed: 'हवा',
      past30DaysTitle: 'पिछले 30 दिनों का मौसम',
      tempToggle: 'तापमान (°C)',
      rainToggle: 'वर्षा (mm)',
      forecast7DayTitle: 'आगामी 7-दिन का पूर्वानुमान',
      sourceLabel: 'स्रोत',
      rainChance: 'बारिश',
    },
    cropHealth: {
      title: 'फसल स्वास्थ्य निगरानी',
      subtitle: 'स्वास्थ्य रुझान, रोग जोखिम और सिंचाई संतुलन ट्रैक करने के लिए साप्ताहिक खेत/पौधे की फोटो अपलोड करें।',
      uploadTitle: 'साप्ताहिक फसल फोटो अपलोड',
      uploadSubtitle: 'सीज़न-भर की स्वास्थ्य टाइमलाइन बनाने के लिए हर सप्ताह दिनांकित फोटो जोड़ें।',
      dateLabel: 'निरीक्षण तिथि',
      notesLabel: 'खेत के नोट्स (वैकल्पिक)',
      notesPlaceholder: 'उदा., बारिश के बाद निचली पत्तियां पीली पड़ रही हैं…',
      photoLabel: 'खेत / पौधे की फोटो',
      choosePhoto: 'साप्ताहिक फोटो अपलोड करें',
      changePhoto: 'फोटो बदलें',
      analyzeButton: 'विश्लेषण करें और जोड़ें',
      analyzingButton: 'साप्ताहिक फोटो का विश्लेषण…',
      illustrativeNotice:
        'प्रदर्शन के लिए 4 सप्ताह का नमूना दिखाया गया है। लाइव AI विश्लेषण के लिए अपनी साप्ताहिक फसल फोटो अपलोड करें।',
      clearDemoButton: 'नया शुरू करें',
      kpiHealthScore: 'फसल स्वास्थ्य स्कोर',
      kpiOutbreakProb: 'रोग प्रकोप संभावना',
      kpiIrrigation: 'सिंचाई संकेत',
      kpiStressStatus: 'फसल तनाव स्तर',
      trendChartTitle: 'साप्ताहिक स्वास्थ्य और रोग प्रवृत्ति',
      timelineTitle: 'फसल स्वास्थ्य टाइमलाइन और सुझाव',
      galleryTitle: 'तिथि-वार फोटो इतिहास',
      explanationLabel: 'विश्लेषण विवरण',
      actionsLabel: 'अनुशंसित कदम',
      riskLabels: {
        green: 'कम जोखिम (स्वस्थ)',
        yellow: 'मध्यम जोखिम (निगरानी)',
        red: 'उच्च जोखिम (तुरंत कार्रवाई)',
      },
      irrigationLabels: {
        Insufficient: 'अपर्याप्त सिंचाई',
        Optimal: 'संतुलित नमी',
        Excessive: 'अत्यधिक सिंचाई',
      },
      emptyTitle: 'अभी कोई साप्ताहिक निरीक्षण दर्ज नहीं है',
      emptyBody: 'स्वास्थ्य प्रगति ट्रैक करने के लिए ऊपर अपनी पहली साप्ताहिक फोटो अपलोड करें।',
    },
    lossOptimisation: {
      title: 'नुकसान अनुकूलन और आय पुनर्प्राप्ति',
      subtitle: 'साल-दर-साल उपज मूल्य की तुलना करें और फसल नुकसान की भरपाई के व्यावहारिक उपाय जानें।',
      inputsTitle: 'उपज और नुकसान विवरण',
      lastYearYieldLabel: 'पिछले वर्ष की उपज मूल्य (₹)',
      currentYearYieldLabel: 'इस वर्ष की उपज मूल्य (₹)',
      estimatedLossLabel: 'अनुमानित वित्तीय नुकसान (₹)',
      estimatedLossHint: 'उपज गिरावट से स्वतः गणना या अपना अनुमानित नुकसान दर्ज करें',
      calculateButton: 'गणना और विश्लेषण करें',
      yoyChartTitle: 'साल-दर-साल उपज तुलना (₹)',
      lossBreakdownTitle: 'नुकसान भरपाई विभाजन (₹)',
      kpiTotalLoss: 'अनुमानित वित्तीय नुकसान',
      kpiRecoverable: 'अनुमानित पुनर्प्राप्ति',
      kpiRemainingGap: 'शेष नुकसान अंतर',
      kpiYoyChange: 'वार्षिक उपज बदलाव',
      strategiesTitle: 'नुकसान भरपाई और वैकल्पिक आय रणनीतियाँ',
      strategiesDisclaimer:
        'आपके खेत के क्षेत्रफल और फसल के आधार पर सांकेतिक अनुमान। सटीक भुगतान के लिए स्थानीय FPO या योजना पोर्टल पर जांचें।',
      estimatedRecoveryLabel: 'संभावित पुनर्प्राप्ति',
      benefitsHeading: 'संभावित लाभ',
      eligibilityHeading: 'पात्रता और सुरक्षा',
      stepsHeading: 'करने योग्य कदम',
      strategyTitles: {
        carbon_credit: 'कृषि कार्बन क्रेडिट कार्यक्रम',
        composting: 'उपयुक्त खराब फसल से कम्पोस्ट और जैविक खाद',
        cattle_feed: 'सुरक्षित फसल अवशेष को पशु चारे के रूप में बेचना',
        waste_monetization: 'कृषि अपशिष्ट मुद्रीकरण (पेलेट्स, बायोचार)',
        compensation: 'पात्र मुआवजा और वित्तीय सहायता',
      },
      feasibilityLabels: {
        High: 'उच्च उपयुक्तता',
        Medium: 'मध्यम उपयुक्तता',
        Conditional: 'शर्त आधारित',
      },
      noLossTitle: 'दर्ज मूल्यों के अनुसार कोई शुद्ध उपज नुकसान नहीं',
      noLossBody:
        'इस वर्ष की उपज पिछले वर्ष के बराबर या अधिक है। आप फिर भी नीचे अतिरिक्त आय के विकल्प देख सकते हैं।',
      askSchemesCta: 'पात्र योजनाएं देखें',
    },
    information: {
      title: 'जानकारी और वित्तीय सहायता',
      subtitle: 'फसल बीमा, केंद्र और राज्य योजनाएं, सब्सिडी, NGO अनुदान और आपदा मुआवजा एक ही स्थान पर।',
      searchPlaceholder: 'योजना का नाम, लाभ, राज्य या फसल खोजें…',
      allCategories: 'सभी कार्यक्रम',
      onlyMyFarmToggle: 'मेरे खेत के अनुकूल',
      matchedBadge: 'आपके खेत के अनुकूल',
      allIndiaBadge: 'अखिल भारतीय',
      benefitsHeading: 'मुख्य लाभ',
      eligibilityHeading: 'पात्रता मानदंड',
      documentsHeading: 'आवश्यक दस्तावेज़',
      deadlineHeading: 'आवेदन समयसीमा',
      applyButton: 'आधिकारिक पोर्टल',
      askAiAboutScheme: 'AI से पात्रता पूछें',
      emptyTitle: 'कोई योजना नहीं मिली',
      emptyBody: 'खोज शब्द बदलें या सभी कार्यक्रम चुनें।',
      categories: {
        Insurance: 'बीमा',
        'Central & State Schemes': 'केंद्र और राज्य',
        Subsidies: 'सब्सिडी',
        'NGO Grants': 'NGO अनुदान',
        Compensation: 'मुआवजा',
      },
    },
    floatingChatbot: {
      generalLabel: 'AI चैटबॉट से पूछें',
      financialLabel: 'योजना सहायक से पूछें',
      financialTooltip: 'अपने खेत के अनुसार सरकारी और वित्तीय योजनाएं खोजें',
      financialBannerTitle: 'वित्तीय सहायता संदर्भ सक्रिय',
      financialBannerBody:
        'AI चैटबॉट आपके सहेजे गए खेत के विवरण के आधार पर फसल बीमा, सब्सिडी, NGO अनुदान और मुआवजा खोजने में मदद के लिए तैयार है।',
      switchToGeneral: 'सामान्य फसल मोड पर जाएं',
      financialPrompts: {
        eligibleSchemes: 'मेरे सहेजे गए खेत के लिए कौन-सी सरकारी योजनाएं और सब्सिडी उपयुक्त हैं?',
        cropLossClaim: 'PMFBY या SDRF फसल नुकसान मुआवजा दावा करने की चरण-दर-चरण प्रक्रिया बताएं।',
        microIrrigationSubsidy: 'मेरे राज्य में ड्रिप/स्प्रिंकलर सिंचाई पर कितनी सब्सिडी मिलेगी?',
        documentsChecklist: 'फसल बीमा और राहत आवेदन के लिए जरूरी दस्तावेजों की सूची बताएं।',
      },
    },
  },
  mr: {
    tabs: {
      chatbot: 'AI चॅटबॉट',
      chatbotShort: 'AI चॅटबॉट',
      cropHealth: 'पीक आरोग्य निरीक्षण',
      cropHealthShort: 'पीक आरोग्य',
      lossOptimisation: 'नुकसान व्यवस्थापन',
      lossOptimisationShort: 'नुकसान भरपाई',
      information: 'माहिती व आर्थिक सहाय्य',
      informationShort: 'योजना व मदत',
    },
    voiceAutoFill: {
      title: 'आवाजाने ऑटो-फिल',
      subtitle: 'तुमचे ठिकाण, क्षेत्रफळ, पीक, हंगाम आणि मागील वर्षाचे उत्पन्न बोला',
      startButton: 'शेतीची माहिती बोला',
      stopButton: 'ऐकणे थांबवा',
      listeningStatus: 'ऐकत आहे… निवडलेल्या भाषेत नैसर्गिकरीत्या बोला',
      extractingStatus: 'शेतीची माहिती भरत आहे…',
      reviewBanner:
        'आवाजातून माहिती भरली आहे. कृपया खाली तपासा किंवा दुरुस्त करा आणि सेव्ह करा.',
      examplePrompt: 'उदा., "अमरावती महाराष्ट्र 5 एकर कापूस खरीप हंगाम मागील वर्षी 125000 रुपये"',
      unsupportedError: 'या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. कृपया हाताने माहिती भरा.',
      failedError: 'आवाजातून माहिती समजली नाही. कृपया पुन्हा प्रयत्न करा.',
      transcriptLabel: 'ऐकलेले:',
    },
    weather: {
      title: 'हवामान निरीक्षण',
      subtitle: 'सध्याचे हवामान, मागील ३० दिवस आणि पुढील ७ दिवसांचा अंदाज',
      refreshButton: 'रिफ्रेश',
      loading: 'तुमच्या शेताचे हवामान लोड होत आहे…',
      error: 'सध्या हवामान लोड होऊ शकले नाही. पुन्हा प्रयत्न करा.',
      submitPrompt: 'तुमच्या ठिकाणाचे हवामान पाहण्यासाठी वरील शेतीची माहिती सेव्ह करा.',
      currentHeading: 'सध्याची स्थिती',
      temperature: 'तापमान',
      feelsLike: 'जाणवणारे',
      humidity: 'आर्द्रता',
      rainfall: 'पाऊस',
      windSpeed: 'वारा',
      past30DaysTitle: 'मागील ३० दिवसांचे हवामान',
      tempToggle: 'तापमान (°C)',
      rainToggle: 'पाऊस (mm)',
      forecast7DayTitle: 'पुढील ७ दिवसांचा अंदाज',
      sourceLabel: 'स्रोत',
      rainChance: 'पाऊस',
    },
    cropHealth: {
      title: 'पीक आरोग्य निरीक्षण',
      subtitle: 'आरोग्य कल, रोग धोका आणि सिंचन संतुलन तपासण्यासाठी साप्ताहिक शेताचे फोटो अपलोड करा.',
      uploadTitle: 'साप्ताहिक पीक फोटो अपलोड',
      uploadSubtitle: 'संपूर्ण हंगामाची आरोग्य टाइमलाइन तयार करण्यासाठी दर आठवड्याला फोटो जोडा.',
      dateLabel: 'निरीक्षण तारीख',
      notesLabel: 'शेताच्या नोंदी (पर्यायी)',
      notesPlaceholder: 'उदा., पावसानंतर खालची पाने पिवळी पडत आहेत…',
      photoLabel: 'शेत / झाडाचा फोटो',
      choosePhoto: 'साप्ताहिक फोटो अपलोड करा',
      changePhoto: 'फोटो बदला',
      analyzeButton: 'विश्लेषण करा व जोडा',
      analyzingButton: 'साप्ताहिक फोटोचे विश्लेषण…',
      illustrativeNotice:
        'प्रात्यक्षिकासाठी ४ आठवड्यांचा नमुना दाखवला आहे. थेट AI विश्लेषणासाठी तुमचा साप्ताहिक फोटो अपलोड करा.',
      clearDemoButton: 'नवीन सुरू करा',
      kpiHealthScore: 'पीक आरोग्य गुण',
      kpiOutbreakProb: 'रोग प्रादुर्भाव शक्यता',
      kpiIrrigation: 'सिंचन संकेत',
      kpiStressStatus: 'पीक ताण पातळी',
      trendChartTitle: 'साप्ताहिक आरोग्य व रोग कल',
      timelineTitle: 'पीक आरोग्य टाइमलाइन व उपाय',
      galleryTitle: 'तारीखनिहाय फोटो इतिहास',
      explanationLabel: 'विश्लेषण स्पष्टीकरण',
      actionsLabel: 'शिफारस केलेली पावले',
      riskLabels: {
        green: 'कमी धोका (निरोगी)',
        yellow: 'मध्यम धोका (लक्ष द्या)',
        red: 'उच्च धोका (त्वरित उपाय)',
      },
      irrigationLabels: {
        Insufficient: 'अपुरे सिंचन',
        Optimal: 'योग्य ओलावा',
        Excessive: 'अतिरिक्त सिंचन',
      },
      emptyTitle: 'अद्याप साप्ताहिक नोंदी नाहीत',
      emptyBody: 'पीक आरोग्य प्रगती तपासण्यासाठी वर पहिला साप्ताहिक फोटो अपलोड करा.',
    },
    lossOptimisation: {
      title: 'नुकसान व्यवस्थापन आणि उत्पन्न पुनर्वसन',
      subtitle: 'वार्षिक उत्पन्न मूल्याची तुलना करा आणि पीक नुकसानीतून अतिरिक्त उत्पन्नाचे मार्ग शोधा.',
      inputsTitle: 'उत्पन्न व नुकसान माहिती',
      lastYearYieldLabel: 'मागील वर्षाचे उत्पन्न मूल्य (₹)',
      currentYearYieldLabel: 'चालू वर्षाचे उत्पन्न मूल्य (₹)',
      estimatedLossLabel: 'अंदाजित आर्थिक नुकसान (₹)',
      estimatedLossHint: 'उत्पन्न घटीवरून स्वयंचलित गणना किंवा स्वतःचा अंदाज भरा',
      calculateButton: 'गणना व विश्लेषण करा',
      yoyChartTitle: 'वार्षिक उत्पन्न तुलना (₹)',
      lossBreakdownTitle: 'नुकसान भरपाई विभाजन (₹)',
      kpiTotalLoss: 'अंदाजित आर्थिक नुकसान',
      kpiRecoverable: 'अंदाजित भरपाई',
      kpiRemainingGap: 'उर्वरित नुकसान तूट',
      kpiYoyChange: 'वार्षिक उत्पन्न बदल',
      strategiesTitle: 'नुकसान भरपाई व पर्यायी उत्पन्न धोरणे',
      strategiesDisclaimer:
        'तुमच्या जमिनीचे क्षेत्रफळ व पिकानुसार सांकेतिक अंदाज. अचूक लाभासाठी स्थानिक FPO किंवा योजना पोर्टल तपासा.',
      estimatedRecoveryLabel: 'संभाव्य पुनर्प्राप्ती',
      benefitsHeading: 'संभाव्य फायदे',
      eligibilityHeading: 'पात्रता व सुरक्षितता',
      stepsHeading: 'कृती टप्पे',
      strategyTitles: {
        carbon_credit: 'कृषी कार्बन क्रेडिट कार्यक्रम',
        composting: 'योग्य खराब पिकापासून कंपोस्ट व सेंद्रिय खत',
        cattle_feed: 'सुरक्षित पीक अवशेष जनावरांचा चारा म्हणून विक्री',
        waste_monetization: 'कृषी कचरा मूल्यवर्धन (पेलेट्स, बायोचार)',
        compensation: 'पात्र नुकसान भरपाई व आर्थिक सहाय्य',
      },
      feasibilityLabels: {
        High: 'उत्तम जुळणी',
        Medium: 'मध्यम जुळणी',
        Conditional: 'अटीनुसार',
      },
      noLossTitle: 'नोंदवलेल्या मूल्यांनुसार निव्वळ नुकसान नाही',
      noLossBody:
        'चालू वर्षाचे उत्पन्न मागील वर्षापेक्षा जास्त किंवा समान आहे. तरीही खालील अतिरिक्त उत्पन्न पर्याय पहा.',
      askSchemesCta: 'पात्र योजना पहा',
    },
    information: {
      title: 'माहिती व आर्थिक सहाय्य',
      subtitle: 'पीक विमा, केंद्र व राज्य योजना, अनुदान, NGO मदत आणि आपत्ती भरपाई यांची एकत्रित माहिती.',
      searchPlaceholder: 'योजनेचे नाव, लाभ, राज्य किंवा पीक शोधा…',
      allCategories: 'सर्व कार्यक्रम',
      onlyMyFarmToggle: 'माझ्या शेताशी जुळणाऱ्या',
      matchedBadge: 'तुमच्या शेतासाठी योग्य',
      allIndiaBadge: 'अखिल भारतीय',
      benefitsHeading: 'मुख्य फायदे',
      eligibilityHeading: 'पात्रता निकष',
      documentsHeading: 'आवश्यक कागदपत्रे',
      deadlineHeading: 'अर्जाची मुदत',
      applyButton: 'अधिकृत पोर्टल',
      askAiAboutScheme: 'AI ला पात्रता विचारा',
      emptyTitle: 'जुळणाऱ्या योजना आढळल्या नाहीत',
      emptyBody: 'शोध शब्द बदला किंवा सर्व कार्यक्रम निवडा.',
      categories: {
        Insurance: 'विमा',
        'Central & State Schemes': 'केंद्र व राज्य',
        Subsidies: 'अनुदान',
        'NGO Grants': 'NGO मदत',
        Compensation: 'नुकसान भरपाई',
      },
    },
    floatingChatbot: {
      generalLabel: 'AI चॅटबॉटला विचारा',
      financialLabel: 'योजना सहाय्यकाला विचारा',
      financialTooltip: 'तुमच्या शेतानुसार आर्थिक योजना व अनुदान शोधा',
      financialBannerTitle: 'आर्थिक सहाय्य संदर्भ सक्रिय',
      financialBannerBody:
        'तुमच्या जतन केलेल्या शेतीच्या माहितीनुसार पीक विमा, अनुदान, NGO मदत आणि भरपाई शोधण्यासाठी AI चॅटबॉट सज्ज आहे.',
      switchToGeneral: 'सामान्य पीक मोडवर जा',
      financialPrompts: {
        eligibleSchemes: 'माझ्या शेतीच्या माहितीनुसार कोणत्या सरकारी योजना व अनुदान मिळू शकते?',
        cropLossClaim: 'PMFBY किंवा SDRF पीक नुकसान भरपाईसाठी दावा कसा करावा?',
        microIrrigationSubsidy: 'माझ्या राज्यात ठिबक/तुषार सिंचनासाठी किती अनुदान मिळते?',
        documentsChecklist: 'पीक विमा आणि मदतीसाठी कोणती कागदपत्रे लागतात?',
      },
    },
  },
  kn: {
    tabs: {
      chatbot: 'AI ಚಾಟ್‌ಬಾಟ್',
      chatbotShort: 'AI ಚಾಟ್‌ಬಾಟ್',
      cropHealth: 'ಬೆಳೆ ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ',
      cropHealthShort: 'ಬೆಳೆ ಆರೋಗ್ಯ',
      lossOptimisation: 'ನಷ್ಟ ನಿರ್ವಹಣೆ',
      lossOptimisationShort: 'ನಷ್ಟ ಚೇತರಿಕೆ',
      information: 'ಮಾಹಿತಿ ಮತ್ತು ಹಣಕಾಸು ನೆರವು',
      informationShort: 'ಯೋಜನೆಗಳು',
    },
    voiceAutoFill: {
      title: 'ಧ್ವನಿ ಸ್ವಯಂ-ಭರ್ತಿ',
      subtitle: 'ನಿಮ್ಮ ಸ್ಥಳ, ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ, ಬೆಳೆ, ಋತು ಮತ್ತು ಕಳೆದ ವರ್ಷದ ಆದಾಯವನ್ನು ಹೇಳಿ',
      startButton: 'ಜಮೀನಿನ ವಿವರ ಹೇಳಿ',
      stopButton: 'ಆಲಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
      listeningStatus: 'ಆಲಿಸುತ್ತಿದೆ… ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ ಸಹಜವಾಗಿ ಮಾತನಾಡಿ',
      extractingStatus: 'ಜಮೀನಿನ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಲಾಗುತ್ತಿದೆ…',
      reviewBanner:
        'ಧ್ವನಿಯಿಂದ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ತಿದ್ದುಪಡಿ ಮಾಡಿ ಸೇವ್ ಮಾಡಿ.',
      examplePrompt: 'ಉದಾ., "ಕರ್ನಾಟಕ ಧಾರವಾಡ 5 ಎಕರೆ ಹತ್ತಿ ಖರೀಫ್ ಋತು ಕಳೆದ ವರ್ಷ 125000 ರೂಪಾಯಿ"',
      unsupportedError: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೈಯಾರೆ ಭರ್ತಿ ಮಾಡಿ.',
      failedError: 'ಧ್ವನಿಯಿಂದ ವಿವರಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      transcriptLabel: 'ಕೇಳಿಸಿದ್ದು:',
    },
    weather: {
      title: 'ಹವಾಮಾನ ಮೇಲ್ವಿಚಾರಣೆ',
      subtitle: 'ಪ್ರಸ್ತುತ ಹವಾಮಾನ, ಕಳೆದ 30 ದಿನಗಳ ಇತಿಹಾಸ ಮತ್ತು 7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
      refreshButton: 'ರಿಫ್ರೆಶ್',
      loading: 'ನಿಮ್ಮ ಜಮೀನಿನ ಹವಾಮಾನ ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ…',
      error: 'ಈಗ ಹವಾಮಾನ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ರಿಫ್ರೆಶ್ ಮಾಡಿ.',
      submitPrompt: 'ಸ್ಥಳದ ಹವಾಮಾನ ನೋಡಲು ಮೇಲೆ ಜಮೀನಿನ ವಿವರಗಳನ್ನು ಸೇವ್ ಮಾಡಿ.',
      currentHeading: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
      temperature: 'ತಾಪಮಾನ',
      feelsLike: 'ಅನುಭವ',
      humidity: 'ತೇವಾಂಶ',
      rainfall: 'ಮಳೆ',
      windSpeed: 'ಗಾಳಿ',
      past30DaysTitle: 'ಕಳೆದ 30 ದಿನಗಳ ಹವಾಮಾನ',
      tempToggle: 'ತಾಪಮಾನ (°C)',
      rainToggle: 'ಮಳೆ (mm)',
      forecast7DayTitle: 'ಮುಂದಿನ 7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ',
      sourceLabel: 'ಮೂಲ',
      rainChance: 'ಮಳೆ',
    },
    cropHealth: {
      title: 'ಬೆಳೆ ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ',
      subtitle: 'ಆರೋಗ್ಯ ಪ್ರವೃತ್ತಿ, ರೋಗದ ಅಪಾಯ ಮತ್ತು ನೀರಾವರಿ ಸಮತೋಲನಕ್ಕಾಗಿ ವಾರಕ್ಕೊಮ್ಮೆ ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      uploadTitle: 'ಸಾಪ್ತಾಹಿಕ ಜಮೀನು ಫೋಟೋ ಅಪ್‌ಲೋಡ್',
      uploadSubtitle: 'ಋತುವಿನ ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ಕಾಲರೇಖೆಗಾಗಿ ಪ್ರತಿ ವಾರ ದಿನಾಂಕದ ಫೋಟೋ ಸೇರಿಸಿ.',
      dateLabel: 'ಪರಿಶೀಲನೆ ದಿನಾಂಕ',
      notesLabel: 'ಜಮೀನು ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)',
      notesPlaceholder: 'ಉದಾ., ಮಳೆಯ ನಂತರ ಕೆಳಗಿನ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ…',
      photoLabel: 'ಜಮೀನು / ಸಸ್ಯದ ಫೋಟೋ',
      choosePhoto: 'ಸಾಪ್ತಾಹಿಕ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      changePhoto: 'ಫೋಟೋ ಬದಲಾಯಿಸಿ',
      analyzeButton: 'ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಸೇರಿಸಿ',
      analyzingButton: 'ಫೋಟೋ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…',
      illustrativeNotice:
        'ಪ್ರದರ್ಶನಕ್ಕಾಗಿ 4 ವಾರಗಳ ಮಾದರಿ ತೋರಿಸಲಾಗಿದೆ. ನೇರ AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      clearDemoButton: 'ಹೊಸದಾಗಿ ಪ್ರಾರಂಭಿಸಿ',
      kpiHealthScore: 'ಬೆಳೆ ಆರೋಗ್ಯ ಅಂಕ',
      kpiOutbreakProb: 'ರೋಗ ಹರಡುವ ಸಾಧ್ಯತೆ',
      kpiIrrigation: 'ನೀರಾವರಿ ಸೂಚನೆ',
      kpiStressStatus: 'ಬೆಳೆ ಒತ್ತಡ ಮಟ್ಟ',
      trendChartTitle: 'ಸಾಪ್ತಾಹಿಕ ಆರೋಗ್ಯ ಮತ್ತು ರೋಗ ಪ್ರವೃತ್ತಿ',
      timelineTitle: 'ಬೆಳೆ ಆರೋಗ್ಯ ಕಾಲರೇಖೆ ಮತ್ತು ಸಲಹೆಗಳು',
      galleryTitle: 'ದಿನಾಂಕವಾರು ಫೋಟೋ ಇತಿಹಾಸ',
      explanationLabel: 'ವಿಶ್ಲೇಷಣೆ ವಿವರಣೆ',
      actionsLabel: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು',
      riskLabels: {
        green: 'ಕಡಿಮೆ ಅಪಾಯ (ಆರೋಗ್ಯಕರ)',
        yellow: 'ಮಧ್ಯಮ ಅಪಾಯ (ಗಮನಿಸಿ)',
        red: 'ಹೆಚ್ಚಿನ ಅಪಾಯ (ತಕ್ಷಣ ಕ್ರಮ)',
      },
      irrigationLabels: {
        Insufficient: 'ಕಡಿಮೆ ನೀರಾವರಿ',
        Optimal: 'ಸಮತೋಲಿತ ತೇವಾಂಶ',
        Excessive: 'ಅಧಿಕ ನೀರಾವರಿ',
      },
      emptyTitle: 'ಇನ್ನೂ ಸಾಪ್ತಾಹಿಕ ದಾಖಲೆಗಳಿಲ್ಲ',
      emptyBody: 'ಆರೋಗ್ಯ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮೇಲೆ ಮೊದಲ ವಾರದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    },
    lossOptimisation: {
      title: 'ನಷ್ಟ ನಿರ್ವಹಣೆ ಮತ್ತು ಆದಾಯ ಚೇತರಿಕೆ',
      subtitle: 'ವಾರ್ಷಿಕ ಇಳುವರಿ ಮೌಲ್ಯವನ್ನು ಹೋಲಿಸಿ ಮತ್ತು ಬೆಳೆ ನಷ್ಟ ಚೇತರಿಕೆಯ ಪ್ರಾಯೋಗಿಕ ಮಾರ್ಗಗಳನ್ನು ಕಂಡುಕೊಳ್ಳಿ.',
      inputsTitle: 'ಇಳುವರಿ ಮತ್ತು ನಷ್ಟದ ವಿವರಗಳು',
      lastYearYieldLabel: 'ಕಳೆದ ವರ್ಷದ ಇಳುವರಿ ಮೌಲ್ಯ (₹)',
      currentYearYieldLabel: 'ಈ ವರ್ಷದ ಇಳುವರಿ ಮೌಲ್ಯ (₹)',
      estimatedLossLabel: 'ಅಂದಾಜು ಆರ್ಥಿಕ ನಷ್ಟ (₹)',
      estimatedLossHint: 'ಇಳುವರಿ ಕುಸಿತದಿಂದ ಸ್ವಯಂ ಲೆಕ್ಕಾಚಾರ ಅಥವಾ ನಿಮ್ಮ ಅಂದಾಜು ನಮೂದಿಸಿ',
      calculateButton: 'ಲೆಕ್ಕಾಚಾರ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ',
      yoyChartTitle: 'ವಾರ್ಷಿಕ ಇಳುವರಿ ಹೋಲಿಕೆ (₹)',
      lossBreakdownTitle: 'ನಷ್ಟ ಚೇತರಿಕೆ ವಿಭಜನೆ (₹)',
      kpiTotalLoss: 'ಅಂದಾಜು ಆರ್ಥಿಕ ನಷ್ಟ',
      kpiRecoverable: 'ಅಂದಾಜು ಚೇತರಿಕೆ',
      kpiRemainingGap: 'ಉಳಿದ ನಷ್ಟದ ಅಂತರ',
      kpiYoyChange: 'ವಾರ್ಷಿಕ ಇಳುವರಿ ಬದಲಾವಣೆ',
      strategiesTitle: 'ನಷ್ಟ ಚೇತರಿಕೆ ಮತ್ತು ಪರ್ಯಾಯ ಆದಾಯ ತಂತ್ರಗಳು',
      strategiesDisclaimer:
        'ನಿಮ್ಮ ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ ಮತ್ತು ಬೆಳೆ ಆಧಾರಿತ ಅಂದಾಜು. ನಿಖರ ಪಾವತಿಗಾಗಿ ಸ್ಥಳೀಯ FPO ಅಥವಾ ಯೋಜನೆ ಪೋರ್ಟಲ್ ಪರಿಶೀಲಿಸಿ.',
      estimatedRecoveryLabel: 'ಸಂಭಾವ್ಯ ಚೇತರಿಕೆ',
      benefitsHeading: 'ಸಂಭಾವ್ಯ ಪ್ರಯೋಜನಗಳು',
      eligibilityHeading: 'ಅರ್ಹತೆ ಮತ್ತು ಸುರಕ್ಷತೆ',
      stepsHeading: 'ಕಾರ್ಯಗತ ಹಂತಗಳು',
      strategyTitles: {
        carbon_credit: 'ಕೃಷಿ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಯಕ್ರಮಗಳು',
        composting: 'ಸೂಕ್ತ ಹಾಳಾದ ಬೆಳೆಯಿಂದ ಕಾಂಪೋಸ್ಟ್ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ',
        cattle_feed: 'ಸುರಕ್ಷಿತ ಬೆಳೆ ಅವಶೇಷಗಳನ್ನು ಪಶು ಆಹಾರವಾಗಿ ಮಾರಾಟ',
        waste_monetization: 'ಕೃಷಿ ತ್ಯಾಜ್ಯ ಮೌಲ್ಯವರ್ಧನೆ (ಪೆಲೆಟ್ಸ್, ಬಯೋಚಾರ್)',
        compensation: 'ಅರ್ಹ ಪರಿಹಾರ ಮತ್ತು ಹಣಕಾಸು ನೆರವು',
      },
      feasibilityLabels: {
        High: 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ',
        Medium: 'ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ',
        Conditional: 'ಷರತ್ತುಬದ್ಧ',
      },
      noLossTitle: 'ನಮೂದಿಸಿದ ಮೌಲ್ಯಗಳಲ್ಲಿ ನಿವ್ವಳ ನಷ್ಟ ಕಂಡುಬಂದಿಲ್ಲ',
      noLossBody:
        'ಈ ವರ್ಷದ ಇಳುವರಿ ಕಳೆದ ವರ್ಷಕ್ಕೆ ಸಮ ಅಥವಾ ಹೆಚ್ಚಾಗಿದೆ. ಆದರೂ ಕೆಳಗಿನ ಹೆಚ್ಚುವರಿ ಆದಾಯದ ಮಾರ್ಗಗಳನ್ನು ನೋಡಬಹುದು.',
      askSchemesCta: 'ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ',
    },
    information: {
      title: 'ಮಾಹಿತಿ ಮತ್ತು ಹಣಕಾಸು ನೆರವು',
      subtitle: 'ಬೆಳೆ ವಿಮೆ, ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಯೋಜನೆಗಳು, ಸಬ್ಸಿಡಿಗಳು, NGO ಅನುದಾನಗಳು ಮತ್ತು ಪರಿಹಾರ ಕಾರ್ಯಕ್ರಮಗಳು.',
      searchPlaceholder: 'ಯೋಜನೆಯ ಹೆಸರು, ಪ್ರಯೋಜನ, ರಾಜ್ಯ ಅಥವಾ ಬೆಳೆ ಹುಡುಕಿ…',
      allCategories: 'ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳು',
      onlyMyFarmToggle: 'ನನ್ನ ಜಮೀನಿಗೆ ಹೊಂದುವ',
      matchedBadge: 'ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತ',
      allIndiaBadge: 'ಅಖಿಲ ಭಾರತ',
      benefitsHeading: 'ಮುಖ್ಯ ಪ್ರಯೋಜನಗಳು',
      eligibilityHeading: 'ಅರ್ಹತಾ ಮಾನದಂಡ',
      documentsHeading: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
      deadlineHeading: 'ಅರ್ಜಿ ಕೊನೆಯ ದಿನಾಂಕ',
      applyButton: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್',
      askAiAboutScheme: 'AI ಬಳಿ ಅರ್ಹತೆ ಕೇಳಿ',
      emptyTitle: 'ಯಾವುದೇ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      emptyBody: 'ಹುಡುಕಾಟ ಪದವನ್ನು ಬದಲಾಯಿಸಿ ಅಥವಾ ಎಲ್ಲಾ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      categories: {
        Insurance: 'ವಿಮೆ',
        'Central & State Schemes': 'ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ',
        Subsidies: 'ಸಬ್ಸಿಡಿ',
        'NGO Grants': 'NGO ಅನುದಾನ',
        Compensation: 'ಪರಿಹಾರ',
      },
    },
    floatingChatbot: {
      generalLabel: 'AI ಚಾಟ್‌ಬಾಟ್ ಕೇಳಿ',
      financialLabel: 'ಯೋಜನೆ ಸಹಾಯಕರನ್ನು ಕೇಳಿ',
      financialTooltip: 'ನಿಮ್ಮ ಜಮೀನಿಗೆ ಸೂಕ್ತವಾದ ಹಣಕಾಸು ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',
      financialBannerTitle: 'ಹಣಕಾಸು ನೆರವು ಸಂದರ್ಭ ಸಕ್ರಿಯ',
      financialBannerBody:
        'ನಿಮ್ಮ ಉಳಿಸಿದ ಜಮೀನು ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಬೆಳೆ ವಿಮೆ, ಸಬ್ಸಿಡಿ, NGO ಅನುದಾನ ಮತ್ತು ಪರಿಹಾರ ಹುಡುಕಲು AI ಚಾಟ್‌ಬಾಟ್ ಸಿದ್ಧವಾಗಿದೆ.',
      switchToGeneral: 'ಸಾಮಾನ್ಯ ಬೆಳೆ ಮೋಡ್‌ಗೆ ಬದಲಿಸಿ',
      financialPrompts: {
        eligibleSchemes: 'ನನ್ನ ಉಳಿಸಿದ ಜಮೀನು ವಿವರಗಳಿಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು ಸೂಕ್ತ?',
        cropLossClaim: 'PMFBY ಅಥವಾ SDRF ಬೆಳೆ ನಷ್ಟ ಪರಿಹಾರಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಹಂತಗಳನ್ನು ತಿಳಿಸಿ.',
        microIrrigationSubsidy: 'ನನ್ನ ರಾಜ್ಯದಲ್ಲಿ ಹನಿ/ತುಂತುರು ನೀರಾವರಿಗೆ ಎಷ್ಟು ಸಬ್ಸಿಡಿ ಲಭ್ಯವಿದೆ?',
        documentsChecklist: 'ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಪರಿಹಾರ ಅರ್ಜಿಗೆ ಬೇಕಾದ ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಕೊಡಿ.',
      },
    },
  },
};
