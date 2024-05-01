const { PrismaClient } = require("@prisma/client");
const imageKit = require("../libs/imagekit");
const path = require("path");
const qr = require("qr-image");
const prisma = new PrismaClient();
module.exports = {
  imageKitUpload: async (req, res, next) => {
    try {
      if (req.file.size > 510000) {
        return res.status(400).json({
          status: false,
          message: "File too large, maximum image file is 500KB",
          data: null,
        });
      }

      const { judul, deskripsi } = req.body;
      if (!judul || !deskripsi) {
        return res.status(400).json({
          status: false,
          message: "Required field missing",
          data: null,
        });
      }
      const duplicate = await prisma.image.findUnique({
        where: {
          judul: judul,
        },
      });
      if (duplicate) {
        return res.status(400).json({
          status: false,
          message: "Judul already exist",
          data: null,
        });
      }

      let strFile = req.file.buffer.toString("base64");

      let { url, fileId } = await imageKit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });
      let urlTrans = await imageKit.url({
        src: url,
        transformation: [{ width: 300, height: 300 }],
      });
      const imageData = await prisma.image.create({
        data: {
          judul: judul,
          deskripsi: deskripsi,
          image_id: fileId,
          image_url: urlTrans,
        },
      });
      return res.status(201).json({
        status: true,
        message: "Successfully upload data",
        data: imageData,
      });
    } catch (error) {
      next(error);
    }
  },
  imageKitList: async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const limit = 5;
      const totalData = await prisma.image.count({});
      const totalPage = Math.ceil(totalData / limit);
      if (isNaN(page)) {
        return res.status(400).json({
          status: false,
          message: "Incorrect query value",
          data: null,
        });
      }
      if (totalData === 0) {
        return res.status(400).json({
          status: false,
          message: "No image created yet",
          data: null,
        });
      }
      if (+page > totalPage) {
        return res.status(400).json({
          status: false,
          message: "Page exceeded total page",
          data: null,
        });
      }
      const imagesData = await prisma.image.findMany({
        skip: (+page - 1) * limit,
        take: limit,
      });

      return res.status(200).json({
        status: true,
        message: "Successfully get data",
        data: {
          images: imagesData,
          current_page: +page,
          total_page: totalPage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  imageKitDetail: async (req, res, next) => {
    try {
      const id = req.params?.id;
      const imageData = await prisma.image.findUnique({
        where: {
          id: +id,
        },
      });

      if (!imageData) {
        return res.status(404).json({
          status: false,
          message: "Image data not found",
          data: null,
        });
      }
      const detailImg = await imageKit.getFileDetails(imageData.image_id);
      imageData.image_detail = detailImg;
      return res.status(200).json({
        status: true,
        message: "Successfully get detail",
        data: imageData,
      });
    } catch (error) {
      next(error);
    }
  },
  imageKitDelete: async (req, res, next) => {
    try {
      const id = req.params?.id;
      const imageData = await prisma.image.findUnique({
        where: {
          id: +id,
        },
      });

      if (!imageData) {
        return res.status(404).json({
          status: false,
          message: "Image data not found",
          data: null,
        });
      }
      await imageKit.deleteFile(imageData.image_id);
      await prisma.image.delete({
        where: {
          id: +id,
        },
      });
      return res.status(200).json({
        status: true,
        message: "Successfully delete data",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
  imageKitEdit: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { judul, deskripsi } = req.body;

      const imageData = await prisma.image.findUnique({
        where: {
          id: +id,
        },
      });

      if (!imageData) {
        return res.status(404).json({
          status: false,
          message: "Image data not found",
          data: null,
        });
      }

      const duplicate = await prisma.image.findUnique({
        where: {
          judul: judul,
          NOT: {
            id: +id,
          },
        },
      });
      if (duplicate) {
        return res.status(400).json({
          status: false,
          message: "Judul already exist",
          data: null,
        });
      }

      const update = await prisma.image.update({
        where: {
          id: +id,
        },
        data: {
          judul: judul,
          deskripsi: deskripsi,
        },
      });

      return res.status(200).json({
        status: true,
        message: "Successfully update data",
        data: update,
      });
    } catch (error) {
      next(error);
    }
  },
};
