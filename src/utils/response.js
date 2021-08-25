const serverError = (res) => {
  res.status(500).send({
    status: 'failed',
    message: 'internal server error',
  })
}

const data = (res, data) => {
  res.status(200).send({
    status: 'success',
    data,
  })
}

const created = (res, data) => {
  res.status(201).send({
    status: 'success',
    message: 'resource has successfully created',
    data,
  })
}

const updated = (res, data) => {
  res.status(200).send({
    status: 'success',
    message: 'resource has successfully updated',
    data,
  })
}

const deleted = (res, data) => {
  res.status(200).send({
    status: 'success',
    message: 'resource has successfully deleted',
    data,
  })
}

module.exports = {
  serverError,
  data,
  created,
  updated,
  deleted,
}
