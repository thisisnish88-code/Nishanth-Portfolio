import json
import re

def process_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 2. Hero tagline fallback
    html = html.replace('<p class="hero-tagline" id="hero-tagline"></p>', '<p class="hero-tagline" id="hero-tagline">"I build the hardware. I write the firmware. I ship the robot."</p>')

    # 5. Beyond the Lab heading
    html = html.replace('<h2 class="section-title reveal">Building people, not just hardware.</h2>', '<h2 class="section-title reveal">Beyond the build.</h2>')

    # 10. CGPA row
    cgpa_row = '''<div class="terminal-row">
                <span class="prompt">&gt;</span>
                <span class="key">CGPA</span>
                <span class="val highlight">8.68 | VTU | ECE | First Class Distinction</span>
              </div>'''
    project_row = '''<div class="terminal-row">
                <span class="prompt">&gt;</span>
                <span class="key">PROJECTS</span>
                <span class="val highlight">20+ built</span>
              </div>'''
    if project_row in html and cgpa_row not in html:
        html = html.replace(project_row, project_row + '\n              ' + cgpa_row)

    # 11. About bio
    old_bio_target = "I don't just build components. <strong>I build systems.</strong>"
    new_bio_target = "I don't just build components. <strong>I build systems.</strong><br/><br/>For the first year at Fubotics, if the hardware didn't work, there was no one else."
    html = html.replace(old_bio_target, new_bio_target)

    # 6. Rotaract card styling
    # Remove terminal-card and terminal-header, and change structure
    old_rotaract = '''<!-- Rotaract Card -->
        <div class="terminal-card beyond-card rotaract-card reveal delay-2">
          <div class="terminal-header">
            <div class="terminal-dot red"></div>
            <div class="terminal-dot yellow"></div>
            <div class="terminal-dot green"></div>
            <span class="terminal-title">nish@rotaract:~$ cat profile.info</span>
          </div>'''
    
    new_rotaract = '''<!-- Rotaract Card -->
        <div class="beyond-card rotaract-card reveal delay-2" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:1.5rem;">'''
    
    html = html.replace(old_rotaract, new_rotaract)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)


def process_builds():
    with open('builds.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 8. Update Hexarover description
    old_desc = "HOOK: A high-torque, six-wheel terrestrial platform designed for environments where standard locomotion fails.\n\nBuilt with a tank-drive configuration, the Hexarover features six Johnson DC motors housed in a rigid PVC and acrylic frame. This combination maintains a high power-to-weight ratio while providing the structural integrity needed to climb stairs and traverse rough terrain without mechanical fatigue.\n\nThe heart of the drivetrain is the BTS7960 motor driver array. These high-current H-bridges were selected specifically to handle the significant inductive loads of the Johnson motors, which draw substantial current when navigating obstacles. Cheaper alternatives would simply fail under the thermal stress of sustained high-torque operation.\n\nControl is handled via a dual-channel architecture. While primary operation occurs over Bluetooth via an HC-05 module, the system also supports WiFi as a secondary input channel for extended range. Steering is performed differentially, allowing the robot to pivot on its own axis for maximum maneuverability in tight, obstructed spaces.\n\nKEY CHALLENGE: Managing the massive simultaneous current draw of six Johnson motors under heavy load. Preventing power system brownouts required a robust power distribution network and the selection of motor drivers rated significantly above expected peak currents to ensure stability on unpredictable terrain."
    
    # We will just replace everything for data-desc for Hexarover
    match = re.search(r'(<div class="project-card" data-cat="hardware" data-name="Hexarover — 6-Wheel All Terrain Robot" data-media-type="photos" data-media=\'\[.*?\]\'\s+data-desc=")(.*?)(\"\s+data-tech=")', html, re.DOTALL)
    
    if match:
        new_desc = "Six-wheeled terrain-traversing rescue robot built for stairs and uneven surfaces. No custom parts, no 3D printing — PVC/acrylic frame, BTS7960 motor driver, 7.2Ah lead-acid battery. 2-person team. Full mechanical assembly, motor control firmware, and system integration end-to-end."
        html = html[:match.start(2)] + new_desc + html[match.end(2):]

    # Tags
    html = html.replace('<span class="project-tag">Terrain Nav</span>', '<span class="project-tag">Rescue Robotics</span>')

    # Card body desc
    html = html.replace('<div class="project-desc">6-wheel all-terrain platform featuring high-current BTS7960 drivers and a rigid PVC/acrylic frame for robust locomotive navigation.</div>', '<div class="project-desc">Six-wheeled terrain-traversing rescue robot built for stairs and uneven surfaces.</div>')

    with open('builds.html', 'w', encoding='utf-8') as f:
        f.write(html)

process_index()
process_builds()
