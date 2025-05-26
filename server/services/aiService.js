const analyzeTimeline = (issueDate, expiryDate) => {
  const issue = new Date(issueDate);
  const expiry = new Date(expiryDate);
  const duration = expiry - issue;
  const years = duration / (1000 * 60 * 60 * 24 * 365);

  // Simple timeline analysis without extensive context
  if (years <= 0) {
    return {
      icon: "⚠️",
      title: "Timeline Alert",
      description: "Certificate dates require verification. The expiry date appears to be before or same as issue date."
    };
  }

  if (years > 10) {
    return {
      icon: "📅",
      title: "Extended Validity",
      description: `Long-term certificate with ${Math.floor(years)} year validity period. Typical for permanent certifications.`
    };
  }

  return {
    icon: "✅",
    title: "Standard Timeline",
    description: `Certificate follows standard ${Math.floor(years)} year validity period.`
  };
};

const analyzeIssuer = (issuer) => {
  // Simple issuer verification without database lookup
  const verifiedTerms = ['university', 'institute', 'college', 'school', 'academy'];
  const isVerifiedType = verifiedTerms.some(term => 
    issuer.toLowerCase().includes(term)
  );

  return {
    icon: isVerifiedType ? "🏢" : "ℹ️",
    title: "Issuer Analysis",
    description: isVerifiedType 
      ? "Issuer appears to be an educational institution."
      : "Additional verification recommended for this issuer type."
  };
};

const analyzeVerificationStrength = (certificateData) => {
  // Simple verification strength analysis
  let score = 0;
  let factors = [];

  if (certificateData.blockchain_hash) {
    score += 3;
    factors.push("blockchain verification");
  }

  if (certificateData.digital_signature) {
    score += 2;
    factors.push("digital signature");
  }

  if (certificateData.issueDate && certificateData.expiryDate) {
    score += 1;
    factors.push("temporal validation");
  }

  const strengthLevels = {
    0: { icon: "⚠️", level: "Basic", desc: "Basic verification only" },
    1: { icon: "🔒", level: "Standard", desc: "Standard security measures" },
    3: { icon: "🛡️", level: "Enhanced", desc: "Enhanced security protocols" },
    5: { icon: "💪", level: "Strong", desc: "Strong security implementation" }
  };

  const strength = strengthLevels[Math.min(Math.floor(score), 5)] || strengthLevels[0];

  return {
    icon: strength.icon,
    title: `${strength.level} Security`,
    description: `Certificate uses ${strength.desc}${factors.length ? ` including ${factors.join(", ")}.` : "."}`
  };
};

const analyzeCertificate = async (certificateData) => {
  // Perform basic analysis without requiring extensive context
  const insights = [
    analyzeVerificationStrength(certificateData),
    analyzeTimeline(certificateData.issueDate, certificateData.expiryDate),
    analyzeIssuer(certificateData.issuer)
  ];

  // Add certificate-specific insights if available
  if (certificateData.type) {
    insights.push({
      icon: "📜",
      title: "Certificate Type",
      description: `This is a ${certificateData.type} certificate, commonly used for ${
        certificateData.type.toLowerCase().includes('degree') ? 'academic qualifications' : 'professional certifications'
      }.`
    });
  }

  return {
    insights: insights.filter(insight => insight !== null)
  };
};

module.exports = {
  analyzeCertificate
}; 