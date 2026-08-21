Parfait ! Voici votre **Design System centralisé "NovaTech"** prêt à être intégré dans Figma (via des variables et des styles) ou remis à votre équipe de développement.

J'ai compilé l'intégralité des décisions prises lors de nos échanges. Ce document fait office de **"Single Source of Truth"** pour tous vos écrans.

---

# 🚀 NovaTech – Design System (Tokens & UI Kit)

## 1. Identité & Philosophie
- **Marque** : NovaTech – E-commerce tech/gadget pour étudiants.
- **Vibe** : Premium, moderne, accessible.
- **Aesthetic** : Glassmorphism (verre dépoli, profondeur, légèreté).
- **Approche** : **Mobile-First** appliqué au Web. Tous les écrans sont présentés sur un viewport Desktop (1440x900px) avec une zone de contenu centrale en `max-width: 480px` (pour les pages de formulaire/détail) ou s'adaptant en grille.

---

## 2. Couleurs (Core Tokens)

| Élément | Mode Clair (Hex/RGBA) | Mode Sombre (Hex/RGBA) |
| :--- | :--- | :--- |
| **Fond de page** | `#FFFFFF` | `#020617` (Navy profond) |
| **Overlay Mesh (fond)** | Dégradé radial `#667eea` @ 5% / `#764ba2` @ 5% | Dégradé radial (Centre `#1e1b4b`, Bord `#020617`) |
| **Verre (Glass) Standard** | `rgba(255, 255, 255, 0.7)` | `rgba(15, 23, 42, 0.7)` |
| **Backdrop Blur** | `24px` | `24px` |
| **Bordure Glass (Dark only)** | N/A | `1px solid rgba(255, 255, 255, 0.1)` |

### Dégradé Principal (Accent)
- **Linéaire** : `#667eea` → `#764ba2`
- *Utilisation* : Logo, Boutons primaires, Totaux/Prix mis en avant, Tabs actifs, Toggle actif.

### Couleurs Sémantiques
| Statut | Couleur |
| :--- | :--- |
| **Succès / En stock / Complété** | `#22c55e` (Vert) |
| **En attente / Stock faible** | `#f59e0b` (Ambre) |
| **Annulé / Supprimer** | `#ef4444` (Rouge) |
| **Étoiles (Rating)** | `#fbbf24` (Jaune) |

---

## 3. Typographie (Google Fonts)

| Style | Police | Poids | Tailles (Usage) |
| :--- | :--- | :--- | :--- |
| **Display / Logo** | Sora | Bold (700) | `24px` (Logo) |
| **Titres principaux** | Sora | Semi-Bold (600) | `28px` (Login), `32px` (Desktop) |
| **Noms de produits** | Sora | Semi-Bold (600) / Bold | `14px` (Grille), `22px` (Détail) |
| **Labels & Corps** | Inter | Regular (400) | `14px` - `15px` |
| **Prix & Totaux** | Inter | Bold (700) | `16px` (Produit), `28px` (Détail) |
| **Liens / Boutons** | Inter / Sora | Semi-Bold (600) | `14px` - `16px` |

---

## 4. Espacements & Layout (Grid)

| Élément | Valeur (Mobile/Desktop) |
| :--- | :--- |
| **Conteneur principal (max-width)** | `480px` (centré sur desktop) |
| **Padding intérieur des cartes** | `32px` (Mobile) → `40px` (Desktop) |
| **Gap entre éléments (stack)** | `20px` → `24px` (Desktop) |
| **Padding latéral (page)** | `16px` → `20px` (Desktop) |

---

## 5. Composants UI (Spécifications)

### Cartes en Verre (Glass Cards)
- **Border Radius** : `24px` (Standard) → `32px` (Desktop).
- **Ombres (Light)** : `X:0, Y:16, Blur:40, Spread:-4, Opacité: 15%` (couleur `#667eea`).
- **Ombres (Hover)** : `X:0, Y:12, Blur:24, Spread:-2, Opacité: 20%`.

### Champs de saisie (Inputs)
- **Hauteur** : `52px` → `56px` (Desktop).
- **Border Radius** : `12px` → `14px` (Desktop).
- **Bordure** : `1px` transparente (devient le dégradé d'accent au `:focus`).
- **Label** : Inter Regular, `14px`, flottant ou au-dessus.

### Boutons
- **Primaire (Gradient)** :
  - Hauteur : `52px` → `60px` (Desktop).
  - Border Radius : `14px` → `16px`.
  - Remplissage : Dégradé linéaire `#667eea` → `#764ba2`.
  - Texte : Blanc, Sora/Inter Semi-Bold.
- **Secondaire (Outline)** :
  - Fond : Transparent (verre).
  - Bordure : `1.5px` avec le dégradé d'accent.
  - Texte : Dégradé d'accent.

### Chips / Filtres (Catégories & Statuts)
- **Hauteur** : `36px`.
- **Border Radius** : `20px` (Pills).
- **Actif** : Fond dégradé, texte blanc.
- **Inactif** : Bordure `1px` grise (opacité 30%), texte gris.

### Toggle (Dark Mode)
- **Largeur** : `48px` / **Hauteur** : `28px`.
- **Actif** : Fond dégradé `#667eea` → `#764ba2`.
- **Inactif** : Fond gris `#d1d5db`.
- **Bouton interne** : Diamètre `22px`, blanc.
- **Transition** : `0.3s` ease-in-out.

### Badges (Panier / Statuts)
- **Panier** : Cercle rouge `#ef4444`, `18px`, texte blanc `10px`.
- **Statut commande** : Fond couleur @ 10% d'opacité, texte en couleur pleine (Vert, Ambre, Rouge).

---

## 6. Micro-interactions & Motion

| Interaction | Détail technique |
| :--- | :--- |
| **Lift (Hover cartes)** | `transform: translateY(-4px)` → `-8px` (Desktop). Ombre renforcée. |
| **Effet "Shine" (Bouton)** | Pseudo-élément blanc, opacité `30-40%`, `skew(-25deg)`, glissant de gauche à droite au hover. |
| **Flottement (Image/Check)** | Animation en boucle : `translateY(-6px)` sur 3 secondes. |
| **Swipe-to-delete (Panier)** | Indice visuel : fond rouge qui se révèle derrière la carte glissée de `20px`. |
| **Focus Input** | Bordure passant du gris au dégradé d'accent + léger lift de la carte parente. |

---

## 7. Architecture des Écrans (Structure validée)

1.  **Auth** : Login (Email/Mdp/Forgot) → Register (Nom/Email/Mdp/Confirm + Strength indicator).
2.  **Navigation principale** : Navbar haute (Logo, Search, Cart with badge, Avatar). Bottom Navbar (Home, Categories, Cart, Orders, Profile).
3.  **Home** : Hero Banner, Category Chips (scrollable), Product Grid (2 colonnes).
4.  **Product Detail** : Image flottante, Favori, Nom, Prix (gradient), Rating, Description, Sélecteur quantité, Stock, Sticky "Add to Cart", Carrousel "You might also like".
5.  **Cart** : Items (avec swipe hint), Résumé (Sous-total, Livraison, Total gradient), Sticky "Proceed to Checkout". Empty State intégré.
6.  **Checkout** : Résumé commande (collapsé), Formulaire adresse, Paiement, "Place Order".
7.  **Confirmation** : Check animé, numéro de commande, date, boutons (View order / Continue shopping).
8.  **Orders** : Filtres (All, Pending, Completed, Cancelled), Cartes commandes avec miniatures.
9.  **Profile** : Avatar, Nom, Email, "Edit Profile", Paramètres (avec Toggle Dark Mode), Log out (rouge).

---

**Bon à savoir pour Figma :**
- Créez des **Variables de couleur** pour `Bg/Primary`, `Glass/Default`, `Accent/Gradient`.
- Utilisez des **Styles de texte** pour `Sora-H1`, `Inter-Body`, etc.
- Le **Auto Layout** de Figma est idéal pour reproduire les padding/gaps (ex: cartes en `vertical` avec `gap: 24`).

---

Ce document est votre **bible UI**. Il garantit que tous vos futurs prompts ou maquettes resteront parfaitement cohérents. 

Si jamais vous ajoutez un écran (ex: Wishlist ou Recherche), il suffit de piocher dans ce Design System sans tout réinventer. 

Besoin d'ajuster un token précis ou d'exporter ceci en format plus condensé ? Dites-le moi ! 🎨🚀