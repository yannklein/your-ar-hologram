# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create!(email: 'yann@klein.com', password: 'aaaaaa', name: 'Yann Klein', nickname: 'Yannou', bio: 'I\'m a dreamer', picture: 'https://media.licdn.com/dms/image/C5603AQEIQVaMdIZhEA/profile-displayphoto-shrink_200_200/0?e=1571270400&v=beta&t=cBFiZhejRKPKuf5osEYNzjfu43H0Su-VqFE_pIg2jqk')
User.create!(email: 'sean@ronan.com', password: 'aaaaaa', name: 'Sean Ronan', nickname: 'Seany', bio: 'Haha  you never know', picture: 'https://media.licdn.com/dms/image/C5603AQEKUHsK8iS6Jw/profile-displayphoto-shrink_800_800/0?e=1571270400&v=beta&t=6Nf6XpwIV_kaM-E9TptpxJuYxFl8-5FQvM0zGOCX7mA')

# Hologram.create(title: 'Happy Xmas!',
#                 description: 'Yann is wishing you happy Xmas',
#                 qrcode: 'https://raw.githubusercontent.com/Magicstickr/magicstickr.github.io/master/noel2018/sophie/marker/marker_holo',
#                 picture: 'https://pbs.twimg.com/media/DRvG2jUWAAA7f38?format=jpg&name=small',
#                 video:'https://raw.githubusercontent.com/Magicstickr/magicstickr.github.io/master/noel2018/sophie/content/yann.mp4',
#                 user_id: 1
#                 )

url_video = "https://res.cloudinary.com/yanninthesky/video/upload/v1565704830/iuhcsb1jwpuvao0fujiu.mp4"
url_photo = "https://res.cloudinary.com/yanninthesky/video/upload/v1565704830/iuhcsb1jwpuvao0fujiu.jpg"
url_qrcode = "https://res.cloudinary.com/yanninthesky/image/upload/v1565705323/marker_holo_wc4hgg.png"
url_marker = "https://res.cloudinary.com/yanninthesky/raw/upload/v1565706996/marker_holo_okeykz.patt"

sean = Hologram.new(title: 'I\'m getting crazy!',
                description: 'Sean is really getting out of the line, closer to the stars',
                user_id: 2
                )

sean.remote_video_url = url_video
sean.remote_picture_url = url_photo
sean.remote_qrcode_url = url_qrcode
sean.remote_marker_url = url_marker
sean.save

