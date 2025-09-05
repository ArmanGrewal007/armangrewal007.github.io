import os

for root, dirs, files in os.walk('./content/certificates'):
    for file in files:
        if file.endswith('.md'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r+') as f:
              content = f.read()
              content = content.replace('showInProjects: false', 'showInProjects: true')
              f.seek(0)
              f.write(content)
              f.truncate()
            # print(content)
