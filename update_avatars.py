import sys, re

html_file = r'c:\Users\Andra\Documents\3.My Project\MASSUM\index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract members from the current HTML
pattern_member = re.compile(
    r'<div class="organic-card member-card" data-member data-role="(.*?)" data-rank="(.*?)".*?<img alt="(.*?) avatar" src="(.*?)" />.*?<h3 class="member-card__name">(.*?)</h3>.*?<span class="member-card__role body-md">(.*?)</span>',
    re.DOTALL
)

members = pattern_member.findall(content)

cards_html = []
for i, m in enumerate(members):
    role, rank, alt_name, avatar, name, role_lbl = m
    icon = 'star'
    if 'Driver' in role_lbl: icon = 'directions_car'
    elif 'Foodie' in role_lbl: icon = 'restaurant'
    elif 'Gamer' in role_lbl: icon = 'sports_esports'
    elif 'Athlete' in role_lbl: icon = 'sports_basketball'
    elif 'Hype' in role_lbl: icon = 'local_fire_department'
    elif 'Musician' in role_lbl: icon = 'music_note'
    elif 'New Kid' in role_lbl: icon = 'emoji_nature'
    elif 'Explorer' in role_lbl: icon = 'explore'
    elif 'Comedian' in role_lbl: icon = 'sentiment_very_satisfied'
    elif 'Listener' in role_lbl: icon = 'favorite'
    
    rank_lbl = 'OG' if rank == 'og' else ('Recruit' if rank == 'recruit' else 'Regular')
    if role == 'core': rank_lbl += ' / Core Crew'
    elif role == 'founder': rank_lbl += ' / Founder'
    
    new_avatar = './public/minsoc1.jpeg' if i % 2 == 0 else './public/minsoc2.jpeg'
    
    card = f'''        <div class="organic-card member-card" data-member data-role="{role}" data-rank="{rank}">
          <div class="member-card__image-wrapper">
            <img alt="{name} avatar" src="{new_avatar}" />
            <div class="member-card__overlay"></div>
            <span class="material-symbols-outlined filled member-card__role-icon">{icon}</span>
          </div>
          <div class="member-card__info">
            <div class="member-card__top">
              <h3 class="member-card__name">{name}</h3>
            </div>
            <div>
              <span class="member-card__rank label-md">{rank_lbl}</span><br />
              <span class="member-card__role body-md">{role_lbl}</span>
            </div>
          </div>
        </div>'''
    cards_html.append(card)

new_grid = '      <div class="roster__grid">\n' + '\n\n'.join(cards_html) + '\n      </div>'

pattern_grid = r'<div class="roster__grid">.*?      </div>'
new_content = re.sub(pattern_grid, new_grid, content, flags=re.DOTALL)

# Add cache buster
new_content = new_content.replace('href="./styles.css?v=3"', 'href="./styles.css?v=4"')

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'Updated index.html avatars to mini soccer with {len(members)} cards.')
