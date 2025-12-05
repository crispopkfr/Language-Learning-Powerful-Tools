import { AppLanguage } from "../types";

export const translations = {
  en: {
    nav: {
      tools: "Tools",
      profile: "Profile",
      editor: "Writing",
      study: "Study Text"
    },
    input: {
      label: "Writing",
      placeholder: "Type or paste your text here...",
      accuracy: "Accuracy",
      chars: "characters",
      checkGrammar: "Check Grammar",
      stop: "Stop",
      rewrite: "Rewrite",
      close: "Close",
      clear: "Clear text",
      refresh: "Redo rewrite",
      dictate: "Dictate text",
      stopDictate: "Stop dictation",
      edit: "Edit Text"
    },
    styles: {
      Professional: "Professional",
      Casual: "Casual",
      Academic: "Academic",
      Creative: "Creative",
      Formal: "Formal",
      Informal: "Informal",
      Analytical: "Analytical",
      Narrative: "Narrative",
      Persuasive: "Persuasive",
      Descriptive: "Descriptive"
    },
    results: {
      corrected: "Corrected Version",
      explanation: "Explanation",
      styleExplanation: "Style Explanation",
      rewritten: "Rewritten",
      copy: "Copy",
      listen: "Listen",
      stopListen: "Stop listening",
      quickRewrites: "Quick Alternatives"
    },
    profile: {
      language: "Language",
      accuracyRate: "Accuracy Rate",
      accuracyDesc: "Accuracy percentage",
      totalChecks: "Total Checks",
      checksDesc: "Sentences analyzed",
      totalErrors: "Total Errors",
      errorsDesc: "Mistakes identified & fixed",
      recentHistory: "Recent History",
      entries: "entries",
      noHistory: "No history yet. Start checking your grammar!",
      cols: {
        date: "Date",
        text: "Text Preview",
        result: "Result"
      },
      backup: "Backup Data",
      restore: "Restore Data",
      activity: "Activity",
      yearly: "Yearly"
    },
    settings: {
        title: "API Configuration",
        desc: "To use this app, you can provide your own Google Gemini API Key. Your key is stored securely in your browser's local storage and is never sent to our servers.",
        inputLabel: "Gemini API Key",
        placeholder: "Paste your API key here...",
        getKey: "Get a free API key",
        save: "Save Key",
        remove: "Remove Key",
        saved: "Key saved successfully",
        note: "Note: If no key is provided, the app will attempt to use the default environment key."
    },
    errors: {
      generic: "Unable to analyze text at this time. Please check your connection or API key.",
      limit: "API usage limit exceeded. Please try again in a few moments.",
      speech: "Speech recognition is not supported in this browser.",
      missingKey: "API Key Missing. Please add your key in Settings.",
      permissionDenied: "Access denied. Please check your API Key in Settings and ensure it has permissions for Gemini models."
    }
  },
  es: {
    nav: {
      tools: "Herramientas",
      profile: "Perfil",
      editor: "Escritura",
      study: "Estudiar Texto"
    },
    input: {
      label: "Escritura",
      placeholder: "Escribe o pega tu texto aquí...",
      accuracy: "Precisión",
      chars: "caracteres",
      checkGrammar: "Revisar Gramática",
      stop: "Detener",
      rewrite: "Reescribir",
      close: "Cerrar",
      clear: "Borrar texto",
      refresh: "Rehacer",
      dictate: "Dictar texto",
      stopDictate: "Detener dictado",
      edit: "Editar Texto"
    },
    styles: {
      Professional: "Profesional",
      Casual: "Casual",
      Academic: "Académico",
      Creative: "Creativo",
      Formal: "Formal",
      Informal: "Informal",
      Analytical: "Analítico",
      Narrative: "Narrativo",
      Persuasive: "Persuasivo",
      Descriptivo: "Descriptivo",
      Descriptive: "Descriptivo"
    },
    results: {
      corrected: "Versión Corregida",
      explanation: "Explicación",
      styleExplanation: "Explicación de Estilo",
      rewritten: "Reescrito",
      copy: "Copiar",
      listen: "Escuchar",
      stopListen: "Dejar de escuchar"
    },
    profile: {
      language: "Idioma",
      accuracyRate: "Tasa de Aciertos",
      accuracyDesc: "Porcentaje de precisión",
      totalChecks: "Revisiones Totales",
      checksDesc: "Frases analizadas",
      totalErrors: "Errores Totales",
      errorsDesc: "Errores identificados y corregidos",
      recentHistory: "Historial Reciente",
      entries: "entradas",
      noHistory: "Sin historial aún. ¡Empieza a revisar!",
      cols: {
        date: "Fecha",
        text: "Vista Previa",
        result: "Resultado"
      },
      backup: "Respaldar Datos",
      restore: "Restaurar Datos",
      activity: "Actividad",
      yearly: "Anual"
    },
    settings: {
        title: "Configuración API",
        desc: "Para usar esta app, puedes proporcionar tu propia clave API de Google Gemini. Se guarda localmente en tu navegador.",
        inputLabel: "Clave API Gemini",
        placeholder: "Pega tu clave aquí...",
        getKey: "Obtener clave gratis",
        save: "Guardar Clave",
        remove: "Eliminar Clave",
        saved: "Clave guardada",
        note: "Nota: Si no hay clave, se usará la clave predeterminada si existe."
    },
    errors: {
      generic: "No se pudo analizar el texto. Verifica tu conexión o clave API.",
      limit: "Límite de uso de API excedido. Intenta de nuevo en un momento.",
      speech: "El reconocimiento de voz no es compatible con este navegador.",
      missingKey: "Falta la clave API. Agrégala en Configuración."
    }
  },
  pt: {
    nav: {
      tools: "Ferramentas",
      profile: "Perfil",
      editor: "Escrita",
      study: "Estudar Texto"
    },
    input: {
      label: "Escrita",
      placeholder: "Digite ou cole seu texto aqui...",
      accuracy: "Precisão",
      chars: "caracteres",
      checkGrammar: "Verificar Gramática",
      stop: "Parar",
      rewrite: "Reescrever",
      close: "Fechar",
      clear: "Limpar texto",
      refresh: "Refazer",
      dictate: "Ditado",
      stopDictate: "Parar ditado",
      edit: "Editar Texto"
    },
    styles: {
      Professional: "Profissional",
      Casual: "Casual",
      Academic: "Acadêmico",
      Creative: "Criativo",
      Formal: "Formal",
      Informal: "Informal",
      Analytical: "Analítico",
      Narrative: "Narrativo",
      Persuasive: "Persuasivo",
      Descriptive: "Descritivo"
    },
    results: {
      corrected: "Versão Corrigida",
      explanation: "Explicação",
      styleExplanation: "Explicação do Estilo",
      rewritten: "Reescrito",
      copy: "Copiar",
      listen: "Ouvir",
      stopListen: "Parar de ouvir"
    },
    profile: {
      language: "Idioma",
      accuracyRate: "Taxa de Precisão",
      accuracyDesc: "Porcentagem de precisão",
      totalChecks: "Total de Verificações",
      checksDesc: "Frases analisadas",
      totalErrors: "Total de Erros",
      errorsDesc: "Erros identificados e corrigidos",
      recentHistory: "Histórico Recente",
      entries: "entradas",
      noHistory: "Sem histórico ainda. Comece a verificar!",
      cols: {
        date: "Data",
        text: "Prévia",
        result: "Resultado"
      },
      backup: "Backup de Dados",
      restore: "Restaurar Dados",
      activity: "Atividade",
      yearly: "Anual"
    },
    settings: {
        title: "Configuração da API",
        desc: "Para usar este app, forneça sua chave API do Google Gemini. Ela é salva localmente no navegador.",
        inputLabel: "Chave API Gemini",
        placeholder: "Cole sua chave aqui...",
        getKey: "Obter chave grátis",
        save: "Salvar Chave",
        remove: "Remover Chave",
        saved: "Chave salva com sucesso",
        note: "Nota: Se nenhuma chave for fornecida, o app tentará usar a chave padrão."
    },
    errors: {
      generic: "Não foi possível analisar o texto. Verifique sua conexão.",
      limit: "Limite de uso da API excedido. Tente novamente em alguns instantes.",
      speech: "O reconhecimento de voz não é suportado neste navegador.",
      missingKey: "Chave API ausente. Adicione em Configurações."
    }
  },
  fr: {
    nav: {
      tools: "Outils",
      profile: "Profil",
      editor: "Écriture",
      study: "Étudier le Texte"
    },
    input: {
      label: "Écriture",
      placeholder: "Tapez ou collez votre texte ici...",
      accuracy: "Précision",
      chars: "caractères",
      checkGrammar: "Vérifier la grammaire",
      stop: "Arrêter",
      rewrite: "Réécrire",
      close: "Fermer",
      clear: "Effacer le texte",
      refresh: "Refaire",
      dictate: "Dicter le texte",
      stopDictate: "Arrêter la dictée",
      edit: "Modifier le Texte"
    },
    styles: {
      Professional: "Professionnel",
      Casual: "Décontracté",
      Academic: "Académique",
      Creative: "Créatif",
      Formal: "Formel",
      Informal: "Informel",
      Analytical: "Analytique",
      Narrative: "Narratif",
      Persuasive: "Persuasif",
      Descriptive: "Descriptif"
    },
    results: {
      corrected: "Version Corrigée",
      explanation: "Explication",
      styleExplanation: "Explication du Style",
      rewritten: "Réécrit",
      copy: "Copier",
      listen: "Écouter",
      stopListen: "Arrêter l'écoute"
    },
    profile: {
      language: "Langue",
      accuracyRate: "Taux de Précision",
      accuracyDesc: "Pourcentage de précision",
      totalChecks: "Total des Vérifications",
      checksDesc: "Phrases analysées",
      totalErrors: "Total des Erreurs",
      errorsDesc: "Erreurs identifiées et corrigées",
      recentHistory: "Historique Récent",
      entries: "entrées",
      noHistory: "Pas encore d'historique. Commencez à vérifier !",
      cols: {
        date: "Date",
        text: "Aperçu",
        result: "Résultat"
      },
      backup: "Sauvegarder",
      restore: "Restaurer",
      activity: "Activité",
      yearly: "Annuel"
    },
    settings: {
        title: "Configuration API",
        desc: "Pour utiliser l'app, fournissez votre clé API Google Gemini. Elle est stockée localement.",
        inputLabel: "Clé API Gemini",
        placeholder: "Collez votre clé ici...",
        getKey: "Obtenir une clé",
        save: "Enregistrer",
        remove: "Supprimer",
        saved: "Clé enregistrée",
        note: "Note: Sans clé, l'app utilisera la configuration par défaut."
    },
    errors: {
      generic: "Impossible d'analyser le texte. Vérifiez votre connexion.",
      limit: "Limite d'utilisation de l'API dépassée. Réessayez plus tard.",
      speech: "La reconnaissance vocale n'est pas supportée par ce navigateur.",
      missingKey: "Clé API manquante. Ajoutez-la dans les paramètres."
    }
  },
  ja: {
    nav: {
      tools: "ツール",
      profile: "プロフィール",
      editor: "ライティング",
      study: "テキスト学習"
    },
    input: {
      label: "ライティング",
      placeholder: "テキストを入力または貼り付け...",
      accuracy: "正確性",
      chars: "文字",
      checkGrammar: "文法チェック",
      stop: "停止",
      rewrite: "書き換え",
      close: "閉じる",
      clear: "テキストを消去",
      refresh: "やり直し",
      dictate: "音声入力",
      stopDictate: "入力を停止",
      edit: "テキストを編集"
    },
    styles: {
      Professional: "プロフェッショナル",
      Casual: "カジュアル",
      Academic: "アカデミック",
      Creative: "クリエイティブ",
      Formal: "フォーマル",
      Informal: "インフォーマル",
      Analytical: "分析的",
      Narrative: "物語的",
      Persuasive: "説得的",
      Descriptive: "記述的"
    },
    results: {
      corrected: "修正版",
      explanation: "解説",
      styleExplanation: "スタイルの解説",
      rewritten: "書き換え結果",
      copy: "コピー",
      listen: "再生",
      stopListen: "停止"
    },
    profile: {
      language: "言語",
      accuracyRate: "正確率",
      accuracyDesc: "正確率",
      totalChecks: "チェック回数",
      checksDesc: "分析された文章",
      totalErrors: "エラー総数",
      errorsDesc: "特定・修正されたミス",
      recentHistory: "最近の履歴",
      entries: "件",
      noHistory: "履歴はまだありません。文法チェックを始めましょう！",
      cols: {
        date: "日付",
        text: "プレビュー",
        result: "結果"
      },
      backup: "データバックアップ",
      restore: "データ復元",
      activity: "アクティビティ",
      yearly: "年間"
    },
    settings: {
        title: "API設定",
        desc: "アプリを使用するには、Google Gemini APIキーを入力してください。キーはブラウザに安全に保存されます。",
        inputLabel: "Gemini APIキー",
        placeholder: "キーをここに貼り付け...",
        getKey: "キーを無料で取得",
        save: "保存",
        remove: "削除",
        saved: "保存しました",
        note: "注：キーがない場合、デフォルトの設定を使用します。"
    },
    errors: {
      generic: "テキストを分析できませんでした。接続を確認してください。",
      limit: "API使用制限を超えました。しばらくしてから再試行してください。",
      speech: "このブラウザでは音声認識がサポートされていません。",
      missingKey: "APIキーがありません。設定で追加してください。"
    }
  },
  zh: {
    nav: {
      tools: "工具",
      profile: "个人资料",
      editor: "写作",
      study: "学习文本"
    },
    input: {
      label: "写作",
      placeholder: "在此输入或粘贴文本...",
      accuracy: "准确率",
      chars: "字符",
      checkGrammar: "检查语法",
      stop: "停止",
      rewrite: "重写",
      close: "关闭",
      clear: "清除文本",
      refresh: "重试",
      dictate: "语音输入",
      stopDictate: "停止听写",
      edit: "编辑文本"
    },
    styles: {
      Professional: "专业",
      Casual: "休闲",
      Academic: "学术",
      Creative: "创意",
      Formal: "正式",
      Informal: "非正式",
      Analytical: "分析",
      Narrative: "叙述",
      Persuasive: "说服",
      Descriptive: "描述"
    },
    results: {
      corrected: "更正版本",
      explanation: "解释",
      styleExplanation: "风格解释",
      rewritten: "重写结果",
      copy: "复制",
      listen: "朗读",
      stopListen: "停止朗读"
    },
    profile: {
      language: "语言",
      accuracyRate: "准确率",
      accuracyDesc: "准确率百分比",
      totalChecks: "检查总数",
      checksDesc: "分析的句子",
      totalErrors: "错误总数",
      errorsDesc: "已识别并修复的错误",
      recentHistory: "最近历史",
      entries: "条目",
      noHistory: "暂无历史记录。开始检查您的语法！",
      cols: {
        date: "日期",
        text: "预览",
        result: "结果"
      },
      backup: "备份数据",
      restore: "恢复数据",
      activity: "活动",
      yearly: "年度"
    },
    settings: {
        title: "API 设置",
        desc: "要使用此应用，请提供您的 Google Gemini API 密钥。密钥仅保存在您的浏览器中。",
        inputLabel: "Gemini API 密钥",
        placeholder: "在此粘贴密钥...",
        getKey: "获取免费密钥",
        save: "保存密钥",
        remove: "删除密钥",
        saved: "保存成功",
        note: "注意：如果未提供密钥，应用将尝试使用默认设置。"
    },
    errors: {
      generic: "无法分析文本。请检查您的连接或 API 密钥。",
      limit: "超出 API 使用限制。请稍后再试。",
      speech: "此浏览器不支持语音识别。",
      missingKey: "缺少 API 密钥。请在设置中添加。"
    }
  }
};

export const getLanguageName = (lang: AppLanguage): string => {
  switch (lang) {
    case 'en': return 'English';
    case 'es': return 'Español';
    case 'pt': return 'Português';
    case 'fr': return 'Français';
    case 'ja': return '日本語';
    case 'zh': return '中文';
    default: return 'English';
  }
};

export const t = translations.en;
