import { ContactType } from "../enum/ContactType"
import { ImageType } from "../enum/ImageType"
import { PersonName } from "../value-objects/PersonName"
import { Uuid } from "../value-objects/Uuid"
import { Contact } from "./Contact"
import { ProfilePhoto } from "./ProfilePhoto"
import { Resident } from "./Resident"

describe('faf', ()=>
{
  it('d', () => {

    const userId = Uuid.generate()

    const resident = Resident.create(
      userId,
      PersonName.create('Nikollas Kennidy Almeida Cardoso'),
      ProfilePhoto.create(
        'residents/nikollas/profile/profile.png',
        ImageType.PNG,
        124000
      ),
      Array<Contact>()
    )

    console.log(
      resident.id,
      resident.userId,
      resident.name,
      resident.profilePhoto,
      resident.contactList
    )

    resident.addContact(Contact.create(
      ContactType.EMAIL,
      'nikollaskennidy@gmail.com',
      true
    ))

    console.log(
      resident.id,
      resident.userId,
      resident.name,
      resident.profilePhoto,
      resident.contactList
    )

  })

})