/* LabVirtyèl Ayiti — connexion au serveur Supabase.
   Ces deux valeurs sont PUBLIQUES par conception : la sécurité vient des règles du serveur (supabase/schema.sql).
   Ne mettez JAMAIS ici la clé « service_role » ni le mot de passe de la base. */
var LV_SUPABASE = {
  url: 'https://fozklidgxcfptmhrtmlv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvemtsaWRneGNmcHRtaHJ0bWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5NDgyODEsImV4cCI6MjExMDUyNDI4MX0.J7277MbQVIwKg_r3gUZGBL6OxE0EczhEo2vk3oWWTVU',
  storageKey: 'lv-auth'
};
