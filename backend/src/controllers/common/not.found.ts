import { ControllerModel, ErrorModel } from 'app/models'
import { Request, Response } from 'express'

class NotFoundController extends ControllerModel {

    public notFound = async (req: Request, res: Response):
        Promise<void> =>
        this.transaction(req, res, async trx => {
            throw new ErrorModel('NOT_FOUND', 'ERR_111|Bad Request', 'Endpoint not found!')
        })

}
export default new NotFoundController()
