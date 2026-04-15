const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const images = {
  'AI Voice Pendant': 'https://images.unsplash.com/photo-1593508512255-86abcf4e8c15?auto=format&fit=crop&w=800&q=80',
  'Facade Cleaning Robot V2': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  'Duct Cleaning Robot': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
  'Hexarover': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  'Color-Detecting Arm': 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80',
  'BLE Gamepad': 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80',
  'Kinetic Wave Install': 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80',
  'Gesture Car': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'Compass — R&D OS': 'https://images.unsplash.com/photo-1555066925-5fe5c2cbfb9b?auto=format&fit=crop&w=800&q=80',
  'Neuron — AI OS': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
  'IoT Fleet Backend': 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
  'Fubotics Marketing Agent': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  'ESPCam Coin Counter': 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?auto=format&fit=crop&w=800&q=80',
  'Smart Waste Bin': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15f?auto=format&fit=crop&w=800&q=80'
};

const links = {
  'Neuron — Personal AI OS': 'https://app-heyneuron.pages.dev',
};

const originalHtml = html;

// Use regex to locate each project card, replace the contents of .project-thumb
html = html.replace(/<div class="project-card"([^>]+)data-name="([^"]+)"([^>]*)>([\s\S]*?)<div class="project-thumb"[^>]*>[\s\S]*?<div class="project-overlay">/g, (match, beforeCat, name, afterDesc, bodyBefore) => {
  const imgUrl = images[name] || images[name.split(' — ')[0]] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
  let linkAttr = links[name] ? ` data-url="${links[name]}"` : '';
  return `<div class="project-card"${beforeCat}data-name="${name}"${afterDesc}${linkAttr}>${bodyBefore}<div class="project-thumb">
            <img class="project-img" src="${imgUrl}" alt="${name}" loading="lazy" />
            <div class="project-overlay">`;
});

// Add Modal hero image and link to Modal markup
html = html.replace(
  /<div class="modal-header">/,
  `<div class="modal-hero">
        <img id="modal-img" src="" alt="" />
      </div>
      <div class="modal-header">`
);

html = html.replace(
  /<div id="modal-tags" class="modal-tags"><\/div>/,
  `<div id="modal-tags" class="modal-tags"></div>
        <div id="modal-links" class="modal-links" style="margin-top: 1.5rem; display: none;">
          <a id="modal-live-link" href="#" target="_blank" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.8rem;">↗ View Live</a>
        </div>`
);

// We need to make sure the close button is absolute to the modal or over the image
html = html.replace(
  /<button class="modal-close" id="modal-close" aria-label="Close">✕<\/button>/,
  `<!-- modal close button moved inside modal, positioned via css -->`
);

html = html.replace(
  /<div class="modal">/,
  `<div class="modal">
      <button class="modal-close" id="modal-close" aria-label="Close">✕</button>`
);

fs.writeFileSync('index.html', html);
console.log('Update complete.');
