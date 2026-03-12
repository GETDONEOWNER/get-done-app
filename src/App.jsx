import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "menage", label: "Ménage", icon: "🧹", color: "#22c55e", desc: "Nettoyage, entretien, vitres" },
  { id: "repassage", label: "Repassage", icon: "👔", color: "#3b82f6", desc: "Repassage à domicile" },
  { id: "garde_enfants", label: "Garde enfants", icon: "👶", color: "#f59e0b", desc: "Baby-sitting, nounou ponctuelle" },
  { id: "garde_animaux", label: "Garde animaux", icon: "🐾", color: "#ec4899", desc: "Chien, chat, NAC" },
  { id: "montage", label: "Montage meubles", icon: "🪑", color: "#8b5cf6", desc: "IKEA, Conforama, etc." },
  { id: "reparation", label: "Petites réparations", icon: "🔧", color: "#f97316", desc: "Bricolage, installation" },
  { id: "jardinage", label: "Jardinage", icon: "🌿", color: "#10b981", desc: "Tonte, taille, entretien" },
  { id: "plomberie", label: "Plomberie", icon: "🚿", color: "#06b6d4", desc: "Fuites, robinets, WC" },
  { id: "livraison", label: "Livraisons", icon: "📦", color: "#6366f1", desc: "Courses, pharmacie, colis" },
  { id: "aide_personne", label: "Aide à la personne", icon: "🤝", color: "#e11d48", desc: "Seniors, accompagnement" },
];

const SERVICE_DETAILS = {
  menage: {
    sous_services: ["Nettoyage complet", "Nettoyage vitres", "Nettoyage après déménagement", "Entretien régulier", "Nettoyage cuisine/salle de bain"],
    tarif_min: 15, tarif_max: 40, unite: "€/h",
    tips: "Précisez la surface en m² et les produits disponibles",
  },
  repassage: {
    sous_services: ["Repassage à domicile", "Repassage chemises", "Repassage linge de maison", "Collecte + livraison"],
    tarif_min: 12, tarif_max: 25, unite: "€/h",
    tips: "Précisez le nombre de pièces à repasser",
  },
  garde_enfants: {
    sous_services: ["Baby-sitting soir/week-end", "Garde après école", "Garde journée complète", "Accompagnement activités", "Aide aux devoirs"],
    tarif_min: 12, tarif_max: 20, unite: "€/h",
    tips: "Précisez l'âge des enfants et les horaires",
  },
  garde_animaux: {
    sous_services: ["Garde chien/chat", "Promenade chien", "Visite à domicile", "Pet-sitting nuit", "Garde vacances"],
    tarif_min: 10, tarif_max: 35, unite: "€/prestation",
    tips: "Précisez le type et taille de l'animal",
  },
  montage: {
    sous_services: ["Montage meubles IKEA", "Montage cuisine", "Installation étagères", "Montage lit/armoire", "Démontage + remontage"],
    tarif_min: 25, tarif_max: 60, unite: "€/h",
    tips: "Précisez le nombre de meubles et la référence si possible",
  },
  reparation: {
    sous_services: ["Fixation tableau/miroir", "Installation luminaires", "Pose de serrure", "Petite électricité", "Réparation divers"],
    tarif_min: 20, tarif_max: 50, unite: "€/h",
    tips: "Décrivez précisément la réparation nécessaire",
  },
  jardinage: {
    sous_services: ["Tonte pelouse", "Taille haies/arbustes", "Désherbage", "Entretien potager", "Nettoyage jardin"],
    tarif_min: 15, tarif_max: 35, unite: "€/h",
    tips: "Précisez la surface et les outils disponibles",
  },
  plomberie: {
    sous_services: ["Réparation fuite", "Changement robinet", "Débouchage", "Installation WC", "Réparation chasse d'eau"],
    tarif_min: 40, tarif_max: 80, unite: "€/intervention",
    tips: "Décrivez le problème précisément, photo bienvenue",
  },
  livraison: {
    sous_services: ["Courses supermarché", "Livraison pharmacie", "Récupération colis", "Courses marché", "Livraison repas maison"],
    tarif_min: 8, tarif_max: 20, unite: "€/livraison",
    tips: "Précisez l'adresse de récupération et de livraison",
  },
  aide_personne: {
    sous_services: ["Visite personne âgée", "Accompagnement médical", "Aide administrative", "Courses pour senior", "Compagnie/conversation"],
    tarif_min: 15, tarif_max: 25, unite: "€/h",
    tips: "Précisez le type d'aide et la durée estimée",
  },
};

const MOCK_MISSIONS = [
  {
    id: 1, title: "Nettoyage appartement 45m²", category: "menage",
    price: 60, distance: "0.4 km", time: "Il y a 3 min", status: "open",
    desc: "Nettoyage complet avant état des lieux de sortie. Cuisine, salle de bain, 2 chambres et salon. Produits fournis.",
    client: { name: "Sophie M.", rating: 4.9, avatar: "SM" },
    location: "Paris 6e",
  },
  {
    id: 2, title: "Garde de mon golden retriever", category: "garde_animaux",
    price: 30, distance: "1.2 km", time: "Il y a 12 min", status: "open",
    desc: "Max, 3 ans, très sociable. Besoin de quelqu'un samedi toute la journée. Nourriture et jouets fournis.",
    client: { name: "Thomas L.", rating: 4.7, avatar: "TL" },
    location: "Paris 5e",
  },
  {
    id: 3, title: "Repassage 15 chemises", category: "repassage",
    price: 25, distance: "0.8 km", time: "Il y a 20 min", status: "open",
    desc: "15 chemises de travail à repasser. Fer et table à repasser disponibles. Environ 2h de travail.",
    client: { name: "Marie D.", rating: 5.0, avatar: "MD" },
    location: "Paris 6e",
  },
  {
    id: 4, title: "Montage cuisine IKEA complète", category: "montage",
    price: 120, distance: "2.1 km", time: "Il y a 35 min", status: "open",
    desc: "Cuisine IKEA SEKTION, 8 éléments. Tout est livré, besoin d'une journée de travail. Outils fournis.",
    client: { name: "Lucas R.", rating: 4.8, avatar: "LR" },
    location: "Paris 4e",
  },
  {
    id: 5, title: "Baby-sitting vendredi soir", category: "garde_enfants",
    price: 40, distance: "1.5 km", time: "Il y a 1h", status: "open",
    desc: "2 enfants, 4 et 7 ans. Vendredi 19h-23h. Enfants adorables, déjà dîné. Juste veiller et coucher à 21h.",
    client: { name: "Anna K.", rating: 4.6, avatar: "AK" },
    location: "Paris 5e",
  },
  {
    id: 6, title: "Fuite robinet cuisine urgente", category: "plomberie",
    price: 50, distance: "0.6 km", time: "Il y a 5 min", status: "open",
    desc: "Robinet qui fuit depuis ce matin. Eau coupée pour l'instant. Besoin d'intervention rapide.",
    client: { name: "Pierre V.", rating: 4.5, avatar: "PV" },
    location: "Paris 5e",
  },
  {
    id: 7, title: "Tonte pelouse + taille haies", category: "jardinage",
    price: 45, distance: "3.2 km", time: "Il y a 2h", status: "open",
    desc: "Jardin 80m², pelouse + 2 haies. Tondeuse disponible sur place. Prévoir environ 3h.",
    client: { name: "Isabelle C.", rating: 4.9, avatar: "IC" },
    location: "Vincennes",
  },
  {
    id: 8, title: "Visite quotidienne mamie 85 ans", category: "aide_personne",
    price: 20, distance: "1.8 km", time: "Il y a 45 min", status: "open",
    desc: "Ma grand-mère vit seule. Besoin de quelqu'un pour passer 1h chaque matin, l'aider avec le petit déj et s'assurer qu'elle va bien.",
    client: { name: "Julie M.", rating: 5.0, avatar: "JM" },
    location: "Paris 7e",
  },
];

const NOTIFICATIONS = [
  { id: 1, text: "Thomas L. a accepté votre mission 'Livraison pharmacie'", time: "Il y a 2 min", read: false, icon: "✅" },
  { id: 2, text: "Nouvelle mission près de vous : 'Courses Monoprix - 18€'", time: "Il y a 8 min", read: false, icon: "📍" },
  { id: 3, text: "Vous avez reçu une note 5⭐ de Sophie M.", time: "Il y a 1h", read: true, icon: "⭐" },
  { id: 4, text: "Paiement reçu : 25€ pour la mission 'Garde chat'", time: "Hier", read: true, icon: "💰" },
];

export default function DoneApp() {
  const [tab, setTab] = useState("home");
  const [userType, setUserType] = useState(null); // null = not logged in
  const [authStep, setAuthStep] = useState("welcome"); // welcome, login, register
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [chatOpen, setChatOpen] = useState(null);
  const [messages, setMessages] = useState([
    { from: "other", text: "Bonjour ! Je suis disponible pour votre mission.", time: "14:32" },
    { from: "me", text: "Super ! Vous pouvez être là dans combien de temps ?", time: "14:33" },
    { from: "other", text: "Environ 15 minutes, je suis à 800m de vous.", time: "14:34" },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const [missionForm, setMissionForm] = useState({ title: "", desc: "", price: "", category: "delivery", location: "" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "", name: "" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState(null);
  const [mapView, setMapView] = useState(false);
  const [profileTab, setProfileTab] = useState("info");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredMissions = MOCK_MISSIONS.filter(m =>
    (selectedCategory ? m.category === selectedCategory : true) &&
    (activeFilter === "all" ? true : activeFilter === "nearby" ? parseFloat(m.distance) < 1 : m.price <= 20)
  );

  if (!userType) {
    return <AuthScreen authStep={authStep} setAuthStep={setAuthStep} setUserType={setUserType} loginForm={loginForm} setLoginForm={setLoginForm} showToast={showToast} toastMsg={toastMsg} />;
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0f0a", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#fff", padding: "12px 24px", borderRadius: 100, zIndex: 9999, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(34,197,94,0.4)", whiteSpace: "nowrap" }}>
          {toastMsg}
        </div>
      )}

      {/* MISSION DETAIL OVERLAY */}
      {selectedMission && (
        <MissionDetail mission={selectedMission} onClose={() => setSelectedMission(null)} onAccept={() => { showToast("✅ Mission acceptée ! Go !"); setSelectedMission(null); }} onContact={() => { setChatOpen(selectedMission); setSelectedMission(null); setTab("chat"); }} userType={userType} />
      )}

      {/* CREATE MISSION OVERLAY */}
      {showCreateMission && (
        <CreateMission form={missionForm} setForm={setMissionForm} onClose={() => setShowCreateMission(false)} onSubmit={() => { showToast("🚀 Mission publiée !"); setShowCreateMission(false); setMissionForm({ title: "", desc: "", price: "", category: "delivery", location: "" }); }} />
      )}

      {/* NOTIFICATIONS OVERLAY */}
      {showNotifs && (
        <NotificationsPanel notifs={NOTIFICATIONS} onClose={() => setShowNotifs(false)} />
      )}

      {/* CHAT OVERLAY */}
      {tab === "chat" && chatOpen && (
        <ChatPanel chat={chatOpen} messages={messages} newMsg={newMsg} setNewMsg={setNewMsg} onSend={() => { if (newMsg.trim()) { setMessages([...messages, { from: "me", text: newMsg, time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) }]); setNewMsg(""); } }} onClose={() => { setChatOpen(null); setTab("home"); }} />
      )}

      {/* MAIN CONTENT */}
      <div style={{ paddingBottom: 80, minHeight: "100vh" }}>
        {tab === "home" && <HomeTab missions={filteredMissions} categories={CATEGORIES} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onMissionClick={setSelectedMission} showNotifs={showNotifs} setShowNotifs={setShowNotifs} notifs={NOTIFICATIONS} userType={userType} activeFilter={activeFilter} setActiveFilter={setActiveFilter} mapView={mapView} setMapView={setMapView} />}
        {tab === "missions" && <MissionsTab userType={userType} missions={MOCK_MISSIONS} onMissionClick={setSelectedMission} showToast={showToast} />}
        {tab === "chat" && !chatOpen && <ChatListTab onOpen={(m) => setChatOpen(m)} missions={MOCK_MISSIONS} />}
        {tab === "profile" && <ProfileTab userType={userType} setUserType={setUserType} profileTab={profileTab} setProfileTab={setProfileTab} showToast={showToast} />}
      </div>

      {/* BOTTOM NAV */}
      <BottomNav tab={tab} setTab={setTab} onCreateMission={() => setShowCreateMission(true)} userType={userType} />
    </div>
  );
}

// ─── AUTH ───────────────────────────────────────────────────────────────────
function AuthScreen({ authStep, setAuthStep, setUserType, loginForm, setLoginForm, showToast, toastMsg }) {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0f0a", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
      {toastMsg && <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#22c55e", color: "#fff", padding: "12px 24px", borderRadius: 100, zIndex: 9999, fontWeight: 600, fontSize: 14 }}>{toastMsg}</div>}

      {authStep === "welcome" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "60px 28px 40px" }}>
          {/* Hero */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 20 }}>
            <div style={{ width: 90, height: 90, background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: "0 20px 60px rgba(34,197,94,0.4)" }}>✓</div>
            <div>
              <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", letterSpacing: -2, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>Done.</div>
              <div style={{ fontSize: 16, color: "#6b7280", marginTop: 10, lineHeight: 1.5 }}>Des services à la demande,<br />simples, rapides et sûrs.</div>
            </div>
            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", marginTop: 20 }}>
              {[["⚡", "En moins de 30 min", "Trouvez quelqu'un près de vous instantanément"],
                ["🔒", "100% sécurisé", "Paiement protégé, identité vérifiée"],
                ["⭐", "Communauté de confiance", "Système de notation bidirectionnel"]
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{title}</div>
                    <div style={{ color: "#6b7280", fontSize: 12 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 20 }}>
            <button onClick={() => setAuthStep("register")} style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
              Créer un compte gratuit
            </button>
            <button onClick={() => setAuthStep("login")} style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
              Se connecter
            </button>
          </div>
        </div>
      )}

      {(authStep === "login" || authStep === "register") && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "50px 28px 40px" }}>
          <button onClick={() => setAuthStep("welcome")} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", textAlign: "left", fontSize: 24, marginBottom: 20 }}>←</button>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 8 }}>
            {authStep === "login" ? "Bon retour 👋" : "Rejoindre Done 🚀"}
          </div>
          <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
            {authStep === "login" ? "Connectez-vous à votre compte" : "Créez votre compte en 30 secondes"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            {authStep === "register" && (
              <InputField label="Nom complet" placeholder="Sophie Martin" value={loginForm.name} onChange={v => setLoginForm({ ...loginForm, name: v })} icon="👤" />
            )}
            <InputField label="Email" placeholder="vous@email.com" value={loginForm.email} onChange={v => setLoginForm({ ...loginForm, email: v })} icon="✉️" type="email" />
            <InputField label="Mot de passe" placeholder="••••••••" value={loginForm.password} onChange={v => setLoginForm({ ...loginForm, password: v })} icon="🔒" type="password" />

            {authStep === "register" && (
              <div>
                <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10, fontWeight: 500 }}>Je suis :</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[["client", "👤", "Client", "Je cherche des services"], ["provider", "🔧", "Prestataire", "Je propose des services"]].map(([v, ic, lb, sub]) => (
                    <div key={v} onClick={() => setLoginForm({ ...loginForm, type: v })} style={{ flex: 1, background: loginForm.type === v ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)", border: `2px solid ${loginForm.type === v ? "#22c55e" : "rgba(255,255,255,0.08)"}`, borderRadius: 14, padding: 14, cursor: "pointer", textAlign: "center" }}>
                      <div style={{ fontSize: 28 }}>{ic}</div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginTop: 4 }}>{lb}</div>
                      <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 20 }}>
            <button onClick={() => { setUserType(loginForm.type || "client"); showToast(authStep === "login" ? "✅ Connexion réussie !" : "🎉 Bienvenue sur Done !"); }} style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
              {authStep === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
            {/* Social login */}
            <div style={{ display: "flex", gap: 10 }}>
              {[["G", "#fff", "#1a1a1a", "Google"], ["f", "#1877F2", "#fff", "Facebook"]].map(([letter, bg, tc, label]) => (
                <button key={label} onClick={() => { setUserType("client"); showToast(`✅ Connexion ${label} réussie !`); }} style={{ flex: 1, background: bg, color: tc, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  {letter} {label}
                </button>
              ))}
            </div>
            {authStep === "register" && <div style={{ textAlign: "center", color: "#4b5563", fontSize: 11, lineHeight: 1.4 }}>En créant un compte, vous acceptez nos CGU et notre politique de confidentialité.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOME TAB ────────────────────────────────────────────────────────────────
function HomeTab({ missions, categories, selectedCategory, setSelectedCategory, onMissionClick, setShowNotifs, notifs, userType, activeFilter, setActiveFilter, mapView, setMapView }) {
  const unread = notifs.filter(n => !n.read).length;
  return (
    <div>
      {/* Header */}
      <div style={{ padding: "56px 20px 16px", background: "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ color: "#6b7280", fontSize: 14 }}>Bonjour 👋</div>
            <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
              {userType === "provider" ? "Quelles missions" : "Besoin d'aide"}
              <span style={{ color: "#22c55e" }}>{userType === "provider" ? " aujourd'hui ?" : " aujourd'hui ?"}</span>
            </div>
            <div style={{ color: "#4b5563", fontSize: 12, marginTop: 4 }}>📍 Paris, France</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button onClick={() => setMapView(!mapView)} style={{ width: 42, height: 42, background: mapView ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)", border: mapView ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>🗺️</button>
            <button onClick={() => setShowNotifs(true)} style={{ width: 42, height: 42, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 18, cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🔔
              {unread > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "#22c55e", borderRadius: "50%", border: "2px solid #0a0f0a" }} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 16 }}>🔍</span>
          <span style={{ color: "#4b5563", fontSize: 14 }}>Rechercher une mission…</span>
        </div>
      </div>

      {/* Map View */}
      {mapView && <MapMockup missions={missions} onMissionClick={onMissionClick} />}

      {/* Categories */}
      <div style={{ padding: "16px 0 8px" }}>
        <div style={{ paddingLeft: 20, marginBottom: 10, color: "#9ca3af", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Catégories</div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 4, scrollbarWidth: "none" }}>
          <CategoryPill label="Tout" icon="✨" active={!selectedCategory} color="#22c55e" onClick={() => setSelectedCategory(null)} />
          {categories.map(c => <CategoryPill key={c.id} label={c.label} icon={c.icon} active={selectedCategory === c.id} color={c.color} onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)} />)}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, padding: "8px 20px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        {[["all", "🔥 Toutes"], ["nearby", "📍 < 1 km"], ["budget", "💸 < 20€"]].map(([val, lbl]) => (
          <button key={val} onClick={() => setActiveFilter(val)} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: activeFilter === val ? "#22c55e" : "rgba(255,255,255,0.06)", color: activeFilter === val ? "#000" : "#9ca3af", transition: "all 0.2s" }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Missions list */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{missions.length} missions disponibles</div>
        </div>
        {missions.map(m => <MissionCard key={m.id} mission={m} onClick={() => onMissionClick(m)} />)}
        {missions.length === 0 && <div style={{ textAlign: "center", color: "#4b5563", padding: 40 }}>Aucune mission dans cette catégorie 😴</div>}
      </div>
    </div>
  );
}

// ─── MISSIONS TAB ─────────────────────────────────────────────────────────────
function MissionsTab({ userType, missions, onMissionClick, showToast }) {
  const [activeTab, setActiveTab] = useState("active");
  const myMissions = missions.slice(0, 2);
  return (
    <div>
      <div style={{ padding: "56px 20px 16px", background: "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)" }}>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Mes missions</div>
        <div style={{ color: "#4b5563", fontSize: 14, marginTop: 4 }}>Suivez vos missions en cours</div>
      </div>
      <div style={{ display: "flex", gap: 0, padding: "16px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {[["active", "En cours"], ["history", "Historique"]].map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v)} style={{ flex: 1, padding: "10px", border: "none", background: "none", color: activeTab === v ? "#22c55e" : "#6b7280", fontWeight: 600, fontSize: 14, cursor: "pointer", borderBottom: activeTab === v ? "2px solid #22c55e" : "2px solid transparent" }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ padding: "20px" }}>
        {activeTab === "active" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Active mission card */}
            <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ background: "#22c55e", color: "#000", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>EN COURS</div>
                <div style={{ color: "#22c55e", fontWeight: 700 }}>25€</div>
              </div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Livraison pharmacie urgente</div>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Thomas L. est en route · 12 min restantes</div>
              {/* Progress */}
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                {["Mission acceptée", "En route", "Livraison"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= 1 ? "#22c55e" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: i <= 1 ? "#000" : "#4b5563", fontWeight: 700, flexShrink: 0 }}>
                      {i <= 1 ? "✓" : (i + 1)}
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: 2, background: i < 1 ? "#22c55e" : "rgba(255,255,255,0.08)", marginLeft: 4, marginRight: 4 }} />}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, padding: "10px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>💬 Chat</button>
                <button onClick={() => showToast("✅ Mission validée ! Paiement envoyé.")} style={{ flex: 2, background: "#22c55e", border: "none", borderRadius: 12, padding: "10px", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✓ Valider la mission</button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {myMissions.map(m => (
              <div key={m.id} onClick={() => onMissionClick(m)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ color: "#4b5563", fontSize: 12 }}>Terminé · Il y a 3 jours</div>
                  <div style={{ color: "#22c55e", fontWeight: 700 }}>{m.price}€</div>
                </div>
                <div style={{ color: "#fff", fontWeight: 600 }}>{m.title}</div>
                <div style={{ color: "#f59e0b", marginTop: 6, fontSize: 14 }}>★★★★★</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHAT LIST TAB ────────────────────────────────────────────────────────────
function ChatListTab({ onOpen, missions }) {
  return (
    <div>
      <div style={{ padding: "56px 20px 16px", background: "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)" }}>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Messages</div>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
        {missions.slice(0, 4).map((m, i) => (
          <div key={m.id} onClick={() => onOpen(m)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${CATEGORIES.find(c => c.id === m.category)?.color || "#22c55e"}33, ${CATEGORIES.find(c => c.id === m.category)?.color || "#22c55e"}11)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${CATEGORIES.find(c => c.id === m.category)?.color || "#22c55e"}44` }}>
              {m.client.avatar[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{m.client.name}</div>
                <div style={{ color: "#4b5563", fontSize: 12 }}>{m.time}</div>
              </div>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>{m.title}</div>
              {i === 0 && <div style={{ color: "#22c55e", fontSize: 12, marginTop: 2 }}>Je suis à 15 min ✓✓</div>}
            </div>
            {i < 2 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────
function ProfileTab({ userType, setUserType, profileTab, setProfileTab, showToast }) {
  return (
    <div>
      <div style={{ padding: "56px 20px 24px", background: "linear-gradient(180deg, #0d1a0d 0%, #0a0f0a 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#000" }}>SM</div>
          <div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Sophie Martin</div>
            <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>{userType === "provider" ? "Prestataire" : "Client"} · ⭐ 4.9</div>
            <div style={{ color: "#4b5563", fontSize: 12, marginTop: 2 }}>47 missions réalisées</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 20 }}>
          {[["47", "Missions"], ["4.9", "Note moy."], ["€840", "Gagné"]].map(([v, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 10px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ color: "#22c55e", fontSize: 20, fontWeight: 700 }}>{v}</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile tabs */}
      <div style={{ display: "flex", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 0 }}>
        {[["info", "Infos"], ["verification", "Vérification"], ["payment", "Paiement"]].map(([v, l]) => (
          <button key={v} onClick={() => setProfileTab(v)} style={{ flex: 1, padding: "12px 8px", border: "none", background: "none", color: profileTab === v ? "#22c55e" : "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer", borderBottom: profileTab === v ? "2px solid #22c55e" : "2px solid transparent" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>
        {profileTab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[["👤", "Nom", "Sophie Martin"], ["✉️", "Email", "sophie@email.com"], ["📱", "Téléphone", "+33 6 12 34 56 78"], ["📍", "Zone", "Paris 5e & 6e"]].map(([icon, label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ color: "#6b7280", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                  <div style={{ color: "#fff", fontWeight: 500, fontSize: 15 }}>{val}</div>
                </div>
              </div>
            ))}
            <button onClick={() => { setUserType(null); }} style={{ marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, padding: "14px", color: "#ef4444", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Se déconnecter
            </button>
          </div>
        )}
        {profileTab === "verification" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 16, padding: 16 }}>
              <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>✅ Compte vérifié</div>
              <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Votre identité a été vérifiée avec succès.</div>
            </div>
            {[["🪪 Pièce d'identité", "Vérifiée ✓", "#22c55e"], ["📱 Téléphone", "Vérifié ✓", "#22c55e"], ["🏦 IBAN", "Non renseigné", "#f59e0b"]].map(([title, status, color]) => (
              <div key={title} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "#fff", fontSize: 14 }}>{title}</div>
                <div style={{ color, fontWeight: 600, fontSize: 13 }}>{status}</div>
              </div>
            ))}
            <button onClick={() => showToast("💳 Ajout IBAN bientôt disponible")} style={{ background: "#22c55e", border: "none", borderRadius: 14, padding: 16, color: "#000", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>+ Ajouter mon IBAN</button>
          </div>
        )}
        {profileTab === "payment" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 18, padding: 20, color: "#000" }}>
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>Solde disponible</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>€ 127,50</div>
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>En attente : €25,00</div>
            </div>
            <button onClick={() => showToast("💸 Virement en cours…")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16, color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Retirer mes fonds</button>
            <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginTop: 8 }}>Historique</div>
            {[["Livraison pharmacie", "+15€", "14 juin"], ["Garde chat Milo", "+25€", "12 juin"], ["Courses Monoprix", "+18€", "11 juin"], ["Commission Done (-20%)", "-11,60€", "11 juin"]].map(([label, amount, date]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div style={{ color: "#fff", fontSize: 14 }}>{label}</div>
                  <div style={{ color: "#4b5563", fontSize: 12 }}>{date}</div>
                </div>
                <div style={{ color: amount.startsWith("+") ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function MissionCard({ mission, onClick }) {
  const cat = CATEGORIES.find(c => c.id === mission.category);
  return (
    <div onClick={onClick} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 18, cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: cat?.color || "#22c55e", borderRadius: "20px 0 0 20px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginLeft: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>{cat?.icon}</span>
            <div style={{ background: `${cat?.color}22`, color: cat?.color, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 100 }}>{cat?.label}</div>
          </div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{mission.title}</div>
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{mission.desc}</div>
        </div>
        <div style={{ textAlign: "right", marginLeft: 12 }}>
          <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 20 }}>{mission.price}€</div>
          <div style={{ color: "#4b5563", fontSize: 11, marginTop: 2 }}>fixe</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, marginLeft: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>{mission.client.avatar}</div>
          <div style={{ color: "#9ca3af", fontSize: 12 }}>{mission.client.name}</div>
          <div style={{ color: "#f59e0b", fontSize: 11 }}>★{mission.client.rating}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: "#4b5563", fontSize: 12 }}>📍 {mission.distance}</span>
          <span style={{ color: "#4b5563", fontSize: 12 }}>🕐 {mission.time}</span>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ label, icon, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 100, border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`, background: active ? `${color}20` : "rgba(255,255,255,0.04)", color: active ? color : "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s" }}>
      <span>{icon}</span> {label}
    </button>
  );
}

function InputField({ label, placeholder, value, onChange, icon, type = "text" }) {
  return (
    <div>
      <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <span>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15 }} />
      </div>
    </div>
  );
}

function MissionDetail({ mission, onClose, onAccept, onContact, userType }) {
  const cat = CATEGORIES.find(c => c.id === mission.category);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", background: "#0a0f0a" }}>
      {/* Header image placeholder */}
      <div style={{ height: 220, background: `linear-gradient(135deg, ${cat?.color}33, ${cat?.color}11)`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 20, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, opacity: 0.15 }}>{cat?.icon}</div>
        <button onClick={onClose} style={{ position: "absolute", top: 52, left: 20, width: 40, height: 40, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: 12, fontSize: 18, cursor: "pointer", color: "#fff" }}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: `${cat?.color}22`, color: cat?.color, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100, border: `1px solid ${cat?.color}44` }}>{cat?.icon} {cat?.label}</div>
          <div style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>OUVERTE</div>
        </div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 8, fontFamily: "'Space Grotesk', sans-serif" }}>{mission.title}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 100px" }}>
        {/* Price & distance */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[["💰", `${mission.price}€`, "Rémunération"], ["📍", mission.distance, "Distance"], ["🕐", mission.time, "Publié"]].map(([icon, val, label]) => (
            <div key={label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginTop: 4 }}>{val}</div>
              <div style={{ color: "#4b5563", fontSize: 11 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Description</div>
          <div style={{ color: "#d1d5db", fontSize: 15, lineHeight: 1.6 }}>{mission.desc}</div>
        </div>

        {/* Client */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, marginBottom: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Client</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e22, #22c55e11)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>{mission.client.avatar}</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700 }}>{mission.client.name}</div>
              <div style={{ color: "#f59e0b" }}>{"★".repeat(Math.round(mission.client.rating))} <span style={{ color: "#6b7280", fontSize: 12 }}>{mission.client.rating} · Profil vérifié ✓</span></div>
            </div>
          </div>
        </div>

        {/* Safety */}
        <div style={{ background: "rgba(34,197,94,0.05)", borderRadius: 14, padding: 14, border: "1px solid rgba(34,197,94,0.15)" }}>
          <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 13 }}>🔒 Paiement sécurisé</div>
          <div style={{ color: "#4b5563", fontSize: 12, marginTop: 4 }}>L'argent est bloqué sur Done. Vous serez payé dès validation de la mission.</div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px 32px", background: "linear-gradient(0deg, #0a0f0a 80%, transparent)", display: "flex", gap: 10 }}>
        <button onClick={onContact} style={{ width: 52, height: 52, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 22, cursor: "pointer" }}>💬</button>
        {userType === "provider" ? (
          <button onClick={onAccept} style={{ flex: 1, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#000", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
            ✓ Accepter cette mission
          </button>
        ) : (
          <button onClick={onContact} style={{ flex: 1, background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#000", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
            Contacter le prestataire
          </button>
        )}
      </div>
    </div>
  );
}

function CreateMission({ form, setForm, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0a0f0a", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 20px 16px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={step === 1 ? onClose : () => setStep(step - 1)} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 18, cursor: "pointer", color: "#fff" }}>←</button>
        <div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Nouvelle mission</div>
          <div style={{ color: "#4b5563", fontSize: 13 }}>Étape {step}/3</div>
        </div>
        {/* Progress */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {[1, 2, 3].map(s => <div key={s} style={{ width: 24, height: 4, borderRadius: 100, background: s <= step ? "#22c55e" : "rgba(255,255,255,0.1)" }} />)}
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
        {step === 1 && (
          <>
            <div style={{ color: "#d1d5db", fontSize: 16, fontWeight: 600 }}>Quel service cherchez-vous ?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CATEGORIES.map(c => {
                const details = SERVICE_DETAILS[c.id];
                const isSelected = form.category === c.id;
                return (
                  <div key={c.id} onClick={() => setForm({ ...form, category: c.id, price: details?.tarif_min?.toString() || "" })} style={{ background: isSelected ? `${c.color}18` : "rgba(255,255,255,0.04)", border: `2px solid ${isSelected ? c.color : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: `${c.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{c.label}</div>
                      <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{c.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: c.color, fontWeight: 700, fontSize: 13 }}>{details?.tarif_min}-{details?.tarif_max}EUR</div>
                      <div style={{ color: "#4b5563", fontSize: 10 }}>{details?.unite}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <InputField label="Titre de la mission" placeholder="Ex: Livraison cigarettes Marlboro" value={form.title} onChange={v => setForm({ ...form, title: v })} icon="📝" />
            <div>
              <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Description</div>
              <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Décrivez votre mission en détail..." style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 15, outline: "none", resize: "none", height: 120, boxSizing: "border-box" }} />
            </div>
            <InputField label="Adresse" placeholder="Rue, ville" value={form.location} onChange={v => setForm({ ...form, location: v })} icon="📍" />
          </>
        )}
        {step === 3 && (
          <>
            <div style={{ color: "#d1d5db", fontSize: 16, fontWeight: 600 }}>Budget & confirmation</div>
            <div>
              <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Votre budget</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["5", "10", "15", "20", "30", "50"].map(p => (
                  <button key={p} onClick={() => setForm({ ...form, price: p })} style={{ padding: "10px 18px", borderRadius: 100, border: `1px solid ${form.price === p ? "#22c55e" : "rgba(255,255,255,0.1)"}`, background: form.price === p ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)", color: form.price === p ? "#22c55e" : "#9ca3af", fontWeight: 600, cursor: "pointer" }}>
                    {p}€
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Autre montant…" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ marginTop: 10, width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
            {/* Summary */}
            <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16, padding: 16 }}>
              <div style={{ color: "#22c55e", fontWeight: 700, marginBottom: 10 }}>📋 Récapitulatif</div>
              {[["Catégorie", CATEGORIES.find(c => c.id === form.category)?.label], ["Mission", form.title || "—"], ["Adresse", form.location || "—"], ["Budget", form.price ? `${form.price}€` : "—"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "#6b7280", fontSize: 13 }}>{k}</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ padding: "0 20px 32px" }}>
        <button onClick={step < 3 ? () => setStep(step + 1) : onSubmit} style={{ width: "100%", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#000", border: "none", borderRadius: 16, padding: "18px", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>
          {step < 3 ? "Continuer →" : "🚀 Publier la mission"}
        </button>
      </div>
    </div>
  );
}

function ChatPanel({ chat, messages, newMsg, setNewMsg, onSend, onClose }) {
  const bottomRef = useRef(null);
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "#0a0f0a", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 16px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, width: 38, height: 38, fontSize: 16, cursor: "pointer", color: "#fff" }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>{chat.client.avatar}</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{chat.client.name}</div>
          <div style={{ color: "#22c55e", fontSize: 12 }}>● En ligne · {chat.title}</div>
        </div>
        <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 13 }}>🔒 Sécurisé</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", background: m.from === "me" ? "linear-gradient(135deg, #22c55e, #16a34a)" : "rgba(255,255,255,0.07)", borderRadius: m.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px" }}>
              <div style={{ color: m.from === "me" ? "#000" : "#fff", fontSize: 14 }}>{m.text}</div>
              <div style={{ color: m.from === "me" ? "rgba(0,0,0,0.5)" : "#4b5563", fontSize: 11, marginTop: 4, textAlign: "right" }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 16px 32px", display: "flex", gap: 10, alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && onSend()} placeholder="Votre message…" style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "12px 18px", color: "#fff", fontSize: 14, outline: "none" }} />
        <button onClick={onSend} style={{ width: 46, height: 46, background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
    </div>
  );
}

function NotificationsPanel({ notifs, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "#0a0f0a", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 20px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 18, cursor: "pointer", color: "#fff" }}>←</button>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>Notifications</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
        {notifs.map(n => (
          <div key={n.id} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: n.read ? 0.5 : 1 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: n.read ? "rgba(255,255,255,0.04)" : "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 14, lineHeight: 1.4 }}>{n.text}</div>
              <div style={{ color: "#4b5563", fontSize: 12, marginTop: 4 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0, marginTop: 4 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function MapMockup({ missions, onMissionClick }) {
  return (
    <div style={{ height: 280, background: "linear-gradient(135deg, #0d1a0d, #0a1a14)", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Grid lines */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: `${i * 14.3}%`, top: 0, bottom: 0, borderLeft: "1px solid rgba(34,197,94,0.05)" }} />
      ))}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: "absolute", top: `${i * 20}%`, left: 0, right: 0, borderTop: "1px solid rgba(34,197,94,0.05)" }} />
      ))}
      {/* "You are here" */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
        <div style={{ width: 20, height: 20, background: "#3b82f6", borderRadius: "50%", border: "3px solid #fff", boxShadow: "0 0 0 8px rgba(59,130,246,0.2)" }} />
      </div>
      {/* Mission pins */}
      {missions.slice(0, 5).map((m, i) => {
        const cat = CATEGORIES.find(c => c.id === m.category);
        const positions = [[30, 40], [65, 30], [20, 65], [75, 60], [55, 75]];
        return (
          <div key={m.id} onClick={() => onMissionClick(m)} style={{ position: "absolute", left: `${positions[i]?.[0]}%`, top: `${positions[i]?.[1]}%`, transform: "translate(-50%, -100%)", cursor: "pointer" }}>
            <div style={{ background: cat?.color || "#22c55e", borderRadius: "12px 12px 12px 0", padding: "6px 10px", fontSize: 12, fontWeight: 700, color: "#000", boxShadow: `0 4px 12px ${cat?.color}66`, whiteSpace: "nowrap" }}>
              {cat?.icon} {m.price}€
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.6)", color: "#6b7280", fontSize: 11, padding: "4px 8px", borderRadius: 8 }}>Paris, France</div>
    </div>
  );
}

function BottomNav({ tab, setTab, onCreateMission, userType }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(10,15,10,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "8px 0 20px", backdropFilter: "blur(20px)", zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        {[["home", "🏠", "Accueil"], ["missions", "📋", "Missions"]].map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 16px" }}>
            <span style={{ fontSize: 22, filter: tab === id ? "none" : "grayscale(1) opacity(0.5)" }}>{icon}</span>
            <span style={{ color: tab === id ? "#22c55e" : "#4b5563", fontSize: 10, fontWeight: 600 }}>{label}</span>
          </button>
        ))}
        {/* Create button */}
        <button onClick={onCreateMission} style={{ width: 56, height: 56, background: "linear-gradient(135deg, #22c55e, #16a34a)", border: "none", borderRadius: "50%", fontSize: 26, cursor: "pointer", boxShadow: "0 4px 20px rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700, marginBottom: 4 }}>+</button>
        {[["chat", "💬", "Messages"], ["profile", "👤", "Profil"]].map(([id, icon, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 16px" }}>
            <span style={{ fontSize: 22, filter: tab === id ? "none" : "grayscale(1) opacity(0.5)" }}>{icon}</span>
            <span style={{ color: tab === id ? "#22c55e" : "#4b5563", fontSize: 10, fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
