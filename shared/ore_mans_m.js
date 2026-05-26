
  /* DA.ORE_MANS_M - Aggiornato: 2026-05-02 (35 righe Zoho) */
  DA.ORE_MANS_M = {"MODENA":{"2025":{"7":{"op_d":{"er":6087.8,"req":5836.0},"op_ne":{"er":336.0,"req":2232.0},"op_nr":{"er":1416.0,"req":1488.0},"med":{"er":0.0,"req":1170.8},"soc":{"er":22.0,"req":1863.9},"dir":{"er":14.0,"req":570.3},"inf":{"er":0.0,"req":0.0},"mde":{"er":0.0,"req":0.0},"mdr":{"er":0.0,"req":1802.0},"amm":{"er":0.0,"req":0.0}},"8":{"op_d":{"er":5557.8,"req":5471.0},"op_ne":{"er":343.5,"req":2232.0},"op_nr":{"er":3210.0,"req":1488.0},"med":{"er":0.0,"req":1071.0},"soc":{"er":0.0,"req":1762.8},"dir":{"er":0.0,"req":517.9},"inf":{"er":0.0,"req":0.0},"mde":{"er":0.0,"req":0.0},"mdr":{"er":0.0,"req":1642.0},"amm":{"er":0.0,"req":0.0}}}},"DROSSO":{"2025":{"12":{"op_d":{"er":1112.0,"req":1922.0},"op_ne":{"er":152.0,"req":496.0},"op_nr":{"er":0.0,"req":496.0},"med":{"er":0.0,"req":310.3},"soc":{"er":0.0,"req":443.3},"dir":{"er":0.0,"req":186.3},"inf":{"er":0.0,"req":106.3},"mde":{"er":0.0,"req":88.7},"mdr":{"er":0.0,"req":217.0},"amm":{"er":0.0,"req":62.0}}}},"LORANZE":{"2025":{"12":{"op_d":{"er":746.0,"req":744.0},"op_ne":{"er":372.0,"req":372.0},"op_nr":{"er":0.0,"req":0.0},"med":{"er":86.0,"req":88.7},"soc":{"er":144.0,"req":142.0},"dir":{"er":59.0,"req":53.3},"inf":{"er":0.0,"req":80.0},"mde":{"er":0.0,"req":71.0},"mdr":{"er":0.0,"req":0.0},"amm":{"er":7.5,"req":35.6}}},"2026":{"1":{"op_d":{"er":0.0,"req":720.0},"op_ne":{"er":0.0,"req":356.0},"op_nr":{"er":0.0,"req":0.0},"med":{"er":0.0,"req":86.9},"soc":{"er":0.0,"req":139.7},"dir":{"er":0.0,"req":52.2},"inf":{"er":0.0,"req":76.5},"mde":{"er":0.0,"req":69.8},"mdr":{"er":0.0,"req":0.0},"amm":{"er":0.0,"req":34.5}}}}};
  DA.ORE_MANS_KEYS = [{k:"op_d",label:"Op. Diurno"},{k:"op_ne",label:"Op. Notturno Eff."},{k:"op_nr",label:"Op. Notturno Rep."},{k:"med",label:"Mediatore Ling."},{k:"soc",label:"Op. Sociale"},{k:"dir",label:"Direttore/Coord."},{k:"inf",label:"Infermiere"},{k:"mde",label:"Medico Eff."},{k:"mdr",label:"Medico Rep."},{k:"amm",label:"Amministrativo"}];
  DA.getOreMansM = function(cdc,anno,mese) {
    const yearData = (DA.ORE_MANS_M[cdc]||{})[String(anno)]||{};
    if (mese==="all") {
      const t={};DA.ORE_MANS_KEYS.forEach(function(km){t[km.k]={er:0,req:0};});
      Object.values(yearData).forEach(function(md){DA.ORE_MANS_KEYS.forEach(function(km){if(md[km.k]){t[km.k].er+=md[km.k].er||0;t[km.k].req+=md[km.k].req||0;}});});
      return t;
    }
    return yearData[String(mese)]||null;
  };
