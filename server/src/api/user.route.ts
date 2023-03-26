import { Router, type Request, type Response } from 'express'
import { useCases } from '../domain/user'
import { makeUserRepo } from '../repositories/knex/'
import { type ISeachByKm } from '../domain/user/user.repository'

const userRoutes = Router()

userRoutes.get('/all', async (req: Request, res: Response) => {
  try {
    const { limit, km, latitude, longitude } = req.query
    let searchByKm: ISeachByKm | undefined = undefined

    if (latitude && longitude) {
      searchByKm = {
        km: km ? parseInt(km as string) : undefined,
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string)
      }
    }

    const userRepository = makeUserRepo()
    const users = await useCases.getMany(userRepository, limit ? +limit : undefined, searchByKm)
    res.json({ success: true, data: { users } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error })
  }
})

userRoutes.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const userRepository = makeUserRepo()
    const users = await useCases.getByUserId(userRepository, +userId)
    res.json({ success: true, data: { users } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error })
  }
})

userRoutes.post('/create', async (req: Request, res: Response) => {
  try {
    const userRepository = makeUserRepo()
    await useCases.createUser(userRepository, req.body)
    res.json({
      success: true
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error })
  }
})

userRoutes.delete('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const userRepository = makeUserRepo()
    await useCases.deleteByUserId(userRepository, +userId)
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error })
  }
})

userRoutes.patch('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const userRepository = makeUserRepo()
    await useCases.updateUser(userRepository, +userId, req.body)
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error })
  }
})

export { userRoutes }
