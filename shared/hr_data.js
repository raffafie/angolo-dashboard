/* ================================================================
   hr_data.js — Dati HR da Zoho Analytics (Rapporti aggiuntivi)
   Fonte: zoho_client_v2 query su "Rapporti aggiuntivi mensili"
   Aggiornato: 2026-04-28  (ultima sincronizzazione Zoho)

   Struttura: DA.HR_ORE_CDC[CdC][Anno][Mese] = {
     lav:    ore lavorate totali
     nott:   ore notturne
     rep_d:  ore reperibilità diurna
     rep_n:  ore reperibilità notturna
     fest_d: ore festive diurne
     fest_n: ore festive notturne
     giust:  ore giustificate retribuite (ferie, ROL, etc.)
     assenze:ore assenza non retribuita
     n:      numero dipendenti distinti nel periodo
     inc:    indice copertura % (lav/spett)
     inc2:   indice copertura escludendo assenze %
   }
   ================================================================ */

;(function() {
  if (!window.DA) window.DA = {};

  DA.HR_ORE_CDC = {"VICO":{"2025":{"9":{"lav":650.0,"ret":650.0,"spett":650.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":59.0,"fest_n":0.0,"banca":-0.0,"assenze":0.0,"n":4,"inc":100.0,"inc2":100.0},"10":{"lav":606.5,"ret":598.5,"spett":608.0,"giust":0.0,"nott":56.0,"rep_d":0.0,"rep_n":0.0,"fest_d":53.5,"fest_n":8.0,"banca":-1.5,"assenze":0.0,"n":4,"inc":99.8,"inc2":100.0},"1":{"lav":1537.2,"ret":1513.2,"spett":1535.3,"giust":0.0,"nott":153.0,"rep_d":0.0,"rep_n":0.0,"fest_d":208.5,"fest_n":24.0,"banca":1.9,"assenze":0.0,"n":10,"inc":100.1,"inc2":100.0},"4":{"lav":152.0,"ret":152.0,"spett":158.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-6.3,"assenze":0.0,"n":1,"inc":96.0,"inc2":100.0},"3":{"lav":167.5,"ret":167.5,"spett":164.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":2.8,"assenze":0.0,"n":1,"inc":101.7,"inc2":100.0},"6":{"lav":467.0,"ret":427.0,"spett":437.0,"giust":0.0,"nott":88.0,"rep_d":0.0,"rep_n":0.0,"fest_d":51.0,"fest_n":40.0,"banca":30.0,"assenze":0.0,"n":3,"inc":106.9,"inc2":100.0},"7":{"lav":175.0,"ret":175.0,"spett":164.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":40.0,"fest_n":0.0,"banca":10.3,"assenze":0.0,"n":1,"inc":106.3,"inc2":100.0},"8":{"lav":155.0,"ret":147.0,"spett":152.0,"giust":0.0,"nott":40.0,"rep_d":0.0,"rep_n":0.0,"fest_d":16.0,"fest_n":8.0,"banca":3.0,"assenze":0.0,"n":1,"inc":102.0,"inc2":100.0}},"2026":{"1":{"lav":316.0,"ret":300.0,"spett":316.7,"giust":0.0,"nott":32.0,"rep_d":0.0,"rep_n":0.0,"fest_d":33.0,"fest_n":16.0,"banca":-0.7,"assenze":0.0,"n":2,"inc":99.8,"inc2":100.0},"10":{"lav":301.0,"ret":301.0,"spett":328.0,"giust":0.0,"nott":40.0,"rep_d":0.0,"rep_n":0.0,"fest_d":9.0,"fest_n":0.0,"banca":-27.0,"assenze":0.0,"n":3,"inc":91.8,"inc2":100.0},"9":{"lav":330.0,"ret":330.0,"spett":355.3,"giust":0.0,"nott":80.0,"rep_d":0.0,"rep_n":0.0,"fest_d":45.0,"fest_n":0.0,"banca":-25.3,"assenze":0.0,"n":3,"inc":92.9,"inc2":100.0}}},"MODENA":{"2025":{"1":{"lav":2276.0,"ret":2276.0,"spett":2291.6,"giust":0.0,"nott":69.5,"rep_d":0.0,"rep_n":488.0,"fest_d":78.0,"fest_n":0.0,"banca":-15.7,"assenze":0.0,"n":15,"inc":99.3,"inc2":100.0},"2":{"lav":1488.0,"ret":1488.0,"spett":1543.5,"giust":0.0,"nott":84.0,"rep_d":0.0,"rep_n":552.0,"fest_d":33.0,"fest_n":0.0,"banca":115.5,"assenze":171.0,"n":9,"inc":96.4,"inc2":89.7},"8":{"lav":1631.0,"ret":1631.0,"spett":1544.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":184.0,"fest_n":0.0,"banca":-65.0,"assenze":0.0,"n":11,"inc":105.6,"inc2":100.0},"3":{"lav":1469.0,"ret":1469.0,"spett":1382.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":416.0,"fest_d":80.0,"fest_n":0.0,"banca":86.7,"assenze":0.0,"n":9,"inc":106.3,"inc2":100.0},"5":{"lav":939.2,"ret":939.2,"spett":864.0,"giust":0.0,"nott":16.0,"rep_d":0.0,"rep_n":296.0,"fest_d":0.0,"fest_n":0.0,"banca":75.2,"assenze":0.0,"n":5,"inc":108.7,"inc2":100.0},"7":{"lav":502.5,"ret":502.5,"spett":494.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":16.0,"fest_n":0.0,"banca":-156.2,"assenze":0.0,"n":4,"inc":101.7,"inc2":100.0},"12":{"lav":827.5,"ret":827.5,"spett":880.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":816.0,"fest_d":137.0,"fest_n":0.0,"banca":99.5,"assenze":152.0,"n":6,"inc":94.0,"inc2":84.5},"10":{"lav":882.0,"ret":882.0,"spett":864.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":85.0,"fest_n":0.0,"banca":18.0,"assenze":0.0,"n":6,"inc":102.1,"inc2":100.0},"9":{"lav":331.0,"ret":331.0,"spett":338.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":34.5,"fest_n":0.0,"banca":-7.0,"assenze":0.0,"n":2,"inc":97.9,"inc2":100.0},"4":{"lav":902.5,"ret":902.5,"spett":912.5,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":344.0,"fest_d":58.5,"fest_n":0.0,"banca":-10.0,"assenze":0.0,"n":6,"inc":98.9,"inc2":100.0},"6":{"lav":978.5,"ret":973.5,"spett":921.3,"giust":0.0,"nott":12.0,"rep_d":0.0,"rep_n":0.0,"fest_d":80.0,"fest_n":5.0,"banca":-94.8,"assenze":0.0,"n":7,"inc":106.2,"inc2":100.0}},"2024":{"2":{"lav":1609.2,"ret":1609.2,"spett":1363.5,"giust":0.0,"nott":0.0,"rep_d":490.0,"rep_n":1530.0,"fest_d":26.5,"fest_n":0.0,"banca":68.8,"assenze":0.0,"n":9,"inc":118.0,"inc2":100.0},"12":{"lav":668.5,"ret":652.0,"spett":608.0,"giust":0.0,"nott":16.0,"rep_d":0.0,"rep_n":0.0,"fest_d":24.0,"fest_n":16.5,"banca":60.5,"assenze":0.0,"n":4,"inc":110.0,"inc2":100.0},"1":{"lav":476.5,"ret":476.5,"spett":316.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":60.0,"fest_n":0.0,"banca":1.5,"assenze":0.0,"n":3,"inc":150.5,"inc2":100.0}},"2026":{"1":{"lav":1089.0,"ret":1089.0,"spett":1084.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":640.0,"fest_d":85.0,"fest_n":0.0,"banca":157.0,"assenze":152.0,"n":8,"inc":100.5,"inc2":87.8},"10":{"lav":1356.5,"ret":1356.5,"spett":1341.0,"giust":0.0,"nott":24.0,"rep_d":0.0,"rep_n":1120.0,"fest_d":85.0,"fest_n":0.0,"banca":16.5,"assenze":1.0,"n":11,"inc":101.2,"inc2":99.9},"9":{"lav":1754.5,"ret":1754.5,"spett":1673.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":1184.0,"fest_d":104.0,"fest_n":0.0,"banca":80.8,"assenze":0.0,"n":14,"inc":104.8,"inc2":100.0}}},"VICENZA":{"2025":{"1":{"lav":995.0,"ret":995.0,"spett":931.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":87.5,"fest_n":0.0,"banca":64.0,"assenze":0.0,"n":7,"inc":106.9,"inc2":100.0},"5":{"lav":168.5,"ret":168.5,"spett":171.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-2.5,"assenze":0.0,"n":2,"inc":98.5,"inc2":100.0},"12":{"lav":159.5,"ret":159.5,"spett":152.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":7.5,"assenze":0.0,"n":1,"inc":104.9,"inc2":100.0},"2":{"lav":513.5,"ret":513.5,"spett":513.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.5,"assenze":0.0,"n":4,"inc":100.1,"inc2":100.0},"3":{"lav":739.0,"ret":739.0,"spett":758.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":8.0,"fest_n":0.0,"banca":-19.3,"assenze":0.0,"n":5,"inc":97.5,"inc2":100.0},"7":{"lav":436.0,"ret":436.0,"spett":459.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":7.5,"fest_n":0.0,"banca":-23.3,"assenze":0.0,"n":4,"inc":94.9,"inc2":100.0},"8":{"lav":478.5,"ret":478.5,"spett":456.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":30.5,"fest_n":0.0,"banca":22.5,"assenze":0.0,"n":4,"inc":104.9,"inc2":100.0},"10":{"lav":147.0,"ret":147.0,"spett":152.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-5.0,"assenze":0.0,"n":1,"inc":96.7,"inc2":100.0},"4":{"lav":181.0,"ret":181.0,"spett":158.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":6.0,"fest_n":0.0,"banca":22.7,"assenze":0.0,"n":1,"inc":114.3,"inc2":100.0},"6":{"lav":158.5,"ret":158.5,"spett":152.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":22.5,"fest_n":0.0,"banca":6.5,"assenze":0.0,"n":1,"inc":104.3,"inc2":100.0}},"2026":{"1":{"lav":341.0,"ret":341.0,"spett":316.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":37.5,"fest_n":0.0,"banca":24.3,"assenze":0.0,"n":2,"inc":107.7,"inc2":100.0},"10":{"lav":311.0,"ret":311.0,"spett":320.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":7.0,"assenze":16.0,"n":4,"inc":97.2,"inc2":95.1},"9":{"lav":0.0,"ret":0.0,"spett":0.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.0,"assenze":0.0,"n":1,"inc":0,"inc2":0}}},"RIETI":{"2025":{"1":{"lav":0.0,"ret":0.0,"spett":37.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-33.3,"assenze":4.0,"n":2,"inc":0.0,"inc2":0.0},"2":{"lav":160.0,"ret":160.0,"spett":175.5,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":32.0,"fest_n":0.0,"banca":-11.0,"assenze":4.5,"n":2,"inc":91.2,"inc2":97.3},"5":{"lav":0.0,"ret":0.0,"spett":3.2,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.0,"assenze":3.2,"n":1,"inc":0.0,"inc2":0.0},"3":{"lav":183.0,"ret":183.0,"spett":164.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":32.0,"fest_n":0.0,"banca":18.3,"assenze":0.0,"n":1,"inc":111.1,"inc2":100.0},"4":{"lav":0.0,"ret":0.0,"spett":4.2,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.0,"assenze":4.2,"n":1,"inc":0.0,"inc2":0.0},"6":{"lav":171.0,"ret":171.0,"spett":184.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":48.0,"fest_n":0.0,"banca":-13.0,"assenze":0.0,"n":2,"inc":92.9,"inc2":100.0},"7":{"lav":0.0,"ret":0.0,"spett":34.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-34.7,"assenze":0.0,"n":1,"inc":0.0,"inc2":0}},"2026":{"10":{"lav":2.0,"ret":2.0,"spett":8.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-6.0,"assenze":0.0,"n":1,"inc":25.0,"inc2":100.0},"9":{"lav":5.0,"ret":5.0,"spett":43.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-3.7,"assenze":34.7,"n":2,"inc":11.5,"inc2":12.6}}},"DROSSO":{"2025":{"1":{"lav":899.0,"ret":899.0,"spett":892.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":5.0,"fest_n":0.0,"banca":6.3,"assenze":0.0,"n":6,"inc":100.7,"inc2":100.0},"10":{"lav":412.0,"ret":412.0,"spett":412.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.0,"assenze":0.0,"n":3,"inc":100.0,"inc2":100.0},"2":{"lav":826.0,"ret":826.0,"spett":805.5,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":4.0,"fest_n":0.0,"banca":20.5,"assenze":0.0,"n":5,"inc":102.5,"inc2":100.0},"3":{"lav":1181.5,"ret":1181.5,"spett":1152.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":12.2,"fest_n":0.0,"banca":28.8,"assenze":0.0,"n":7,"inc":102.5,"inc2":100.0},"4":{"lav":645.5,"ret":645.5,"spett":633.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":21.0,"fest_n":0.0,"banca":12.2,"assenze":0.0,"n":4,"inc":101.9,"inc2":100.0},"6":{"lav":596.5,"ret":596.5,"spett":582.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":16.5,"fest_n":0.0,"banca":13.8,"assenze":0.0,"n":4,"inc":102.4,"inc2":100.0},"9":{"lav":320.0,"ret":320.0,"spett":329.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-9.3,"assenze":0.0,"n":2,"inc":97.2,"inc2":100.0},"12":{"lav":311.5,"ret":311.5,"spett":304.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":8.0,"fest_n":0.0,"banca":7.5,"assenze":0.0,"n":2,"inc":102.5,"inc2":100.0},"8":{"lav":303.0,"ret":303.0,"spett":304.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-1.0,"assenze":0.0,"n":2,"inc":99.7,"inc2":100.0},"7":{"lav":289.5,"ret":289.5,"spett":294.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-5.2,"assenze":0.0,"n":2,"inc":98.2,"inc2":100.0}},"2026":{"1":{"lav":304.0,"ret":304.0,"spett":316.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-12.7,"assenze":0.0,"n":2,"inc":96.0,"inc2":100.0},"10":{"lav":748.0,"ret":748.0,"spett":748.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.0,"assenze":0.0,"n":5,"inc":100.0,"inc2":100.0},"9":{"lav":654.5,"ret":654.5,"spett":645.7,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":8.8,"assenze":0.0,"n":4,"inc":101.4,"inc2":100.0}}},"PISA":{"2025":{"2":{"lav":475.5,"ret":475.5,"spett":429.8,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":42.0,"fest_n":0.0,"banca":45.8,"assenze":0.0,"n":3,"inc":110.6,"inc2":100.0},"1":{"lav":472.0,"ret":436.0,"spett":530.0,"giust":0.0,"nott":84.0,"rep_d":0.0,"rep_n":0.0,"fest_d":25.0,"fest_n":36.0,"banca":-58.0,"assenze":0.0,"n":4,"inc":89.1,"inc2":100.0},"4":{"lav":434.0,"ret":398.0,"spett":412.5,"giust":0.0,"nott":108.0,"rep_d":0.0,"rep_n":0.0,"fest_d":50.0,"fest_n":36.0,"banca":21.5,"assenze":0.0,"n":3,"inc":105.2,"inc2":100.0},"5":{"lav":275.0,"ret":275.0,"spett":279.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":20.0,"fest_n":0.0,"banca":-4.0,"assenze":0.0,"n":2,"inc":98.6,"inc2":100.0},"3":{"lav":475.0,"ret":451.0,"spett":481.8,"giust":0.0,"nott":72.0,"rep_d":0.0,"rep_n":0.0,"fest_d":13.0,"fest_n":24.0,"banca":-6.8,"assenze":0.0,"n":4,"inc":98.6,"inc2":100.0},"6":{"lav":295.5,"ret":283.5,"spett":145.7,"giust":0.0,"nott":60.0,"rep_d":0.0,"rep_n":0.0,"fest_d":30.0,"fest_n":12.0,"banca":-6.5,"assenze":0.0,"n":2,"inc":202.9,"inc2":100.0},"7":{"lav":421.0,"ret":397.0,"spett":429.0,"giust":0.0,"nott":157.0,"rep_d":0.0,"rep_n":0.0,"fest_d":30.0,"fest_n":24.0,"banca":-8.0,"assenze":0.0,"n":3,"inc":98.1,"inc2":100.0},"9":{"lav":156.0,"ret":144.0,"spett":0.0,"giust":0.0,"nott":48.0,"rep_d":0.0,"rep_n":0.0,"fest_d":24.0,"fest_n":12.0,"banca":-6.5,"assenze":0.0,"n":1,"inc":0,"inc2":100.0},"10":{"lav":276.5,"ret":264.5,"spett":282.0,"giust":0.0,"nott":96.5,"rep_d":0.0,"rep_n":0.0,"fest_d":24.0,"fest_n":12.0,"banca":-5.5,"assenze":0.0,"n":2,"inc":98.0,"inc2":100.0},"12":{"lav":182.0,"ret":182.0,"spett":152.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":24.5,"fest_n":0.0,"banca":30.0,"assenze":0.0,"n":1,"inc":119.7,"inc2":100.0}},"2026":{"1":{"lav":679.0,"ret":655.0,"spett":650.0,"giust":0.0,"nott":168.0,"rep_d":0.0,"rep_n":0.0,"fest_d":54.0,"fest_n":24.0,"banca":29.0,"assenze":0.0,"n":5,"inc":104.5,"inc2":100.0},"10":{"lav":842.8,"ret":818.8,"spett":738.0,"giust":0.0,"nott":96.0,"rep_d":0.0,"rep_n":0.0,"fest_d":24.0,"fest_n":24.0,"banca":104.8,"assenze":0.0,"n":7,"inc":114.2,"inc2":100.0},"9":{"lav":339.0,"ret":327.0,"spett":353.2,"giust":0.0,"nott":60.0,"rep_d":0.0,"rep_n":0.0,"fest_d":12.0,"fest_n":12.0,"banca":-14.2,"assenze":0.0,"n":3,"inc":96.0,"inc2":100.0}}},"LORANZE":{"2025":{"4":{"lav":162.0,"ret":162.0,"spett":158.3,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":36.0,"fest_n":0.0,"banca":3.7,"assenze":0.0,"n":1,"inc":102.3,"inc2":100.0},"12":{"lav":321.0,"ret":285.0,"spett":304.0,"giust":0.0,"nott":132.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":36.0,"banca":17.0,"assenze":0.0,"n":2,"inc":105.6,"inc2":100.0},"5":{"lav":204.0,"ret":168.0,"spett":225.0,"giust":0.0,"nott":168.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":36.0,"banca":33.0,"assenze":54.0,"n":2,"inc":90.7,"inc2":79.1},"3":{"lav":504.0,"ret":444.0,"spett":475.0,"giust":0.0,"nott":276.0,"rep_d":0.0,"rep_n":0.0,"fest_d":24.0,"fest_n":60.0,"banca":29.0,"assenze":0.0,"n":3,"inc":106.1,"inc2":100.0},"6":{"lav":155.0,"ret":155.0,"spett":200.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-45.0,"assenze":0.0,"n":2,"inc":77.5,"inc2":100.0},"8":{"lav":152.0,"ret":152.0,"spett":152.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":0.0,"assenze":0.0,"n":1,"inc":100.0,"inc2":100.0},"2":{"lav":168.5,"ret":168.5,"spett":171.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":24.0,"fest_n":0.0,"banca":-2.5,"assenze":0.0,"n":1,"inc":98.5,"inc2":100.0}},"2026":{"1":{"lav":590.0,"ret":554.0,"spett":420.8,"giust":0.0,"nott":168.0,"rep_d":0.0,"rep_n":0.0,"fest_d":27.0,"fest_n":36.0,"banca":169.2,"assenze":0.0,"n":4,"inc":140.2,"inc2":100.0},"10":{"lav":151.0,"ret":151.0,"spett":152.0,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":0.0,"fest_n":0.0,"banca":-1.0,"assenze":0.0,"n":1,"inc":99.3,"inc2":100.0},"9":{"lav":341.0,"ret":341.0,"spett":327.2,"giust":0.0,"nott":0.0,"rep_d":0.0,"rep_n":0.0,"fest_d":42.0,"fest_n":0.0,"banca":13.8,"assenze":0.0,"n":3,"inc":104.2,"inc2":100.0}}}};

  /* ================================================================
     DA.computeCdlPct(cdcs, annos)
     Calcola le % di composizione costo del lavoro da dati Zoho reali.

     Input:
       cdcs  — array di chiavi CdC es. ['PISA','MODENA']
       annos — array di anni come stringhe es. ['2025'] o ['2025','2026']

     Output: oggetto keyed per CdC, compatibile con DA.COSTO_LAVORO_PCT
       { PISA: { ordinario: X, notturno: Y, ... }, ... }

     Nota: le % sono calcolate sulle ORE (proxy del costo).
     Straordinario non è disponibile in Rapporti aggiuntivi → 0.
     Giustificativi retribuiti → dal campo "giust" (spesso 0 in Zoho).
  ================================================================ */
  DA.computeCdlPct = function(cdcs, annos) {
    const result = {};
    (cdcs || []).forEach(cdc => {
      const agg = { lav: 0, nott: 0, rep_d: 0, rep_n: 0,
                    fest_d: 0, fest_n: 0, giust: 0 };
      (annos || ['2025']).forEach(a => {
        const yearData = (DA.HR_ORE_CDC[cdc] || {})[String(a)] || {};
        Object.values(yearData).forEach(m => {
          agg.lav   += m.lav   || 0;
          agg.nott  += m.nott  || 0;
          agg.rep_d += m.rep_d || 0;
          agg.rep_n += m.rep_n || 0;
          agg.fest_d += m.fest_d || 0;
          agg.fest_n += m.fest_n || 0;
          agg.giust += m.giust || 0;
        });
      });
      const tot = agg.lav || 1;
      const extra = agg.nott + agg.rep_d + agg.rep_n + agg.fest_d + agg.fest_n + agg.giust;
      const ord = Math.max(0, tot - extra);
      result[cdc] = {
        ordinario:             +( ord         / tot * 100).toFixed(1),
        notturno:              +( agg.nott    / tot * 100).toFixed(1),
        festivo_diurno:        +( agg.fest_d  / tot * 100).toFixed(1),
        festivo_notturno:      +( agg.fest_n  / tot * 100).toFixed(1),
        reperibilita_diurna:   +( agg.rep_d   / tot * 100).toFixed(1),
        reperibilita_notturna: +( agg.rep_n   / tot * 100).toFixed(1),
        straordinario:         0,   // non disponibile in HR_ORE_CDC
        giustificativi:        +( agg.giust   / tot * 100).toFixed(1),
      };
    });
    return result;
  };

  /* Elenco CdC disponibili in HR_ORE_CDC (dinamico) */
  DA.HR_CDC_AVAILABLE = Object.keys(DA.HR_ORE_CDC);

  /**
   * Array[12] di ore lavorate mensili (campo "lav") da Zoho HR.
   * Mesi senza dati → null (gestire come N/D o usare fallback).
   * @param {string} k    — chiave CdC (es. 'PISA')
   * @param {number} anno — 2025 o 2026
   */
  DA.getOreMHR = function(k, anno) {
    const yearData = (DA.HR_ORE_CDC[k] || {})[String(anno)] || {};
    return Array(12).fill(null).map((_, mIdx) => {
      const d = yearData[String(mIdx + 1)]; // mesi Zoho sono 1-based
      return (d && d.lav > 0) ? Math.round(d.lav) : null;
    });
  };

  /* ================================================================
     DA.ORE_MANS_M — Ore per mansione da Organico Mensile (Zoho Creator)
     Fonte: [Mansione] Erogato (ore lavorate reali) e Richiesto (capitolato)
     Aggiornato: 2026-05-02 (35 righe Zoho)

     Struttura: DA.ORE_MANS_M[CdC][anno][mese] = {
       op_d:  {er, req}  — Operatore Diurno
       op_ne: {er, req}  — Operatore Notturno Effettivo
       op_nr: {er, req}  — Operatore Notturno Reperibilità
       med:   {er, req}  — Mediatore Linguistico
       soc:   {er, req}  — Operatore Sociale
       dir:   {er, req}  — Direttore/Coordinatore
       inf:   {er, req}  — Infermiere
       mde:   {er, req}  — Medico Effettivo
       mdr:   {er, req}  — Medico Reperibilità
       amm:   {er, req}  — Amministrativo
     }
     Nota: er=erogato (reale), req=richiesto (Allegato A calcolato da sistema)
     Copertura attuale: MODENA 2025 (mesi 7-8), DROSSO 2025 (mese 12),
                        LORANZE 2025 (mese 12), LORANZE 2026 (mese 1)
     Per i mesi senza dati reali, usare DA.getMansioniStimate() come fallback.
     ================================================================ */

  DA.ORE_MANS_M = {"MODENA":{"2025":{"7":{"op_d":{"er":6087.8,"req":5836.0},"op_ne":{"er":336.0,"req":2232.0},"op_nr":{"er":1416.0,"req":1488.0},"med":{"er":0.0,"req":1170.8},"soc":{"er":22.0,"req":1863.9},"dir":{"er":14.0,"req":570.3},"inf":{"er":0.0,"req":0.0},"mde":{"er":0.0,"req":0.0},"mdr":{"er":0.0,"req":1802.0},"amm":{"er":0.0,"req":0.0}},"8":{"op_d":{"er":5557.8,"req":5471.0},"op_ne":{"er":343.5,"req":2232.0},"op_nr":{"er":3210.0,"req":1488.0},"med":{"er":0.0,"req":1071.0},"soc":{"er":0.0,"req":1762.8},"dir":{"er":0.0,"req":517.9},"inf":{"er":0.0,"req":0.0},"mde":{"er":0.0,"req":0.0},"mdr":{"er":0.0,"req":1642.0},"amm":{"er":0.0,"req":0.0}}}},"DROSSO":{"2025":{"12":{"op_d":{"er":1112.0,"req":1922.0},"op_ne":{"er":152.0,"req":496.0},"op_nr":{"er":0.0,"req":496.0},"med":{"er":0.0,"req":310.3},"soc":{"er":0.0,"req":443.3},"dir":{"er":0.0,"req":186.3},"inf":{"er":0.0,"req":106.3},"mde":{"er":0.0,"req":88.7},"mdr":{"er":0.0,"req":217.0},"amm":{"er":0.0,"req":62.0}}}},"LORANZE":{"2025":{"12":{"op_d":{"er":746.0,"req":744.0},"op_ne":{"er":372.0,"req":372.0},"op_nr":{"er":0.0,"req":0.0},"med":{"er":86.0,"req":88.7},"soc":{"er":144.0,"req":142.0},"dir":{"er":59.0,"req":53.3},"inf":{"er":0.0,"req":80.0},"mde":{"er":0.0,"req":71.0},"mdr":{"er":0.0,"req":0.0},"amm":{"er":7.5,"req":35.6}}},"2026":{"1":{"op_d":{"er":0.0,"req":720.0},"op_ne":{"er":0.0,"req":356.0},"op_nr":{"er":0.0,"req":0.0},"med":{"er":0.0,"req":86.9},"soc":{"er":0.0,"req":139.7},"dir":{"er":0.0,"req":52.2},"inf":{"er":0.0,"req":76.5},"mde":{"er":0.0,"req":69.8},"mdr":{"er":0.0,"req":0.0},"amm":{"er":0.0,"req":34.5}}}}};

  /* ================================================================
     DA.HR_COSTI_CDC
     Costo Personale mensile per Centro di Costo (€)
     Fonte: "Costo Personale Angolo" (Zoho Analytics) — anno 2025 completo
     euro_h: costo orario medio da "Costi orari CAS-[CDC]" (LORANZE, PISA)
             o stima (~) per gli altri centri
     ================================================================ */
  DA.HR_COSTI_CDC = {
    DROSSO:  {'2025':{1:129200,2:134352,3:83994,4:81541,5:83476,6:89695,7:91423,8:97611,9:106730,10:109651,11:116361,12:113819}, anno_tot:{2025:1237853}, euroh:{2025:16.50}, euroh_est:{2025:true}},
    LORANZE: {'2025':{1:60925,2:60065,3:39152,4:35592,5:36338,6:37102,7:43184,8:55489,9:48775,10:54114,11:52694,12:55436},      anno_tot:{2025:578865},  euroh:{2025:16.14}, euroh_est:{2025:false}},
    PISA:    {'2025':{1:140748,2:137171,3:88344,4:91301,5:90016,6:98624,7:93465,8:111200,9:121973,10:132178,11:142293,12:148296},anno_tot:{2025:1395609}, euroh:{2025:17.48}, euroh_est:{2025:false}},
    MODENA:  {'2025':{1:659962,2:667254,3:462258,4:480563,5:459281,6:474638,7:458964,8:456288,9:479577,10:491339,11:504707,12:512569},anno_tot:{2025:6107399},euroh:{}, euroh_est:{}},
    VICO:    {'2025':{1:148091,2:143660,3:108692,4:107031,5:107786,6:112439,7:102386,8:94589,9:102292,10:99303,11:110090,12:110169}, anno_tot:{2025:1346530}, euroh:{}, euroh_est:{}},
    VICENZA: {'2025':{1:110293,2:111721,3:77662,4:69603,5:67528,6:70789,7:64421,8:66975,9:77044,10:81222,11:88831,12:97734},         anno_tot:{2025:983822},  euroh:{}, euroh_est:{}},
  };

  /* Chiavi mansioni Allegato A nell'ordine della tabella */
  DA.ORE_MANS_KEYS = [
    {k:'op_d',  label:'Op. Diurno'},
    {k:'op_ne', label:'Op. Notturno Eff.'},
    {k:'op_nr', label:'Op. Notturno Rep.'},
    {k:'med',   label:'Mediatore Ling.'},
    {k:'soc',   label:'Op. Sociale'},
    {k:'dir',   label:'Direttore/Coord.'},
    {k:'inf',   label:'Infermiere'},
    {k:'mde',   label:'Medico Eff.'},
    {k:'mdr',   label:'Medico Rep.'},
    {k:'amm',   label:'Amministrativo'},
  ];

  /**
   * DA.getOreMansM(cdc, anno, mese)
   * Restituisce {mansione: {er, req}} per il periodo richiesto.
   * Ritorna null se non ci sono dati reali Zoho per quel mese.
   * mese può essere numero 1-12 oppure 'all' (somma annuale).
   */
  DA.getOreMansM = function(cdc, anno, mese) {
    const yearData = (DA.ORE_MANS_M[cdc] || {})[String(anno)] || {};
    if (mese === 'all') {
      const totals = {};
      DA.ORE_MANS_KEYS.forEach(function(km) { totals[km.k] = {er: 0, req: 0}; });
      Object.values(yearData).forEach(function(md) {
        DA.ORE_MANS_KEYS.forEach(function(km) {
          if (md[km.k]) {
            totals[km.k].er  += md[km.k].er  || 0;
            totals[km.k].req += md[km.k].req || 0;
          }
        });
      });
      return Object.keys(yearData).length > 0 ? totals : null;
    }
    return yearData[String(mese)] || null;
  };

})();
